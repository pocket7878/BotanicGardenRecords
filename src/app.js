import { GARDENS, REGION_ORDER, SEASONS } from "./data/gardens.js";
import {
  clearState,
  loadState,
  parseImportedState,
  saveState,
  serializeState,
} from "./storage.js";

const elements = {
  summaryGardens: document.querySelector("#summaryGardens"),
  summarySeasons: document.querySelector("#summarySeasons"),
  summaryComplete: document.querySelector("#summaryComplete"),
  searchInput: document.querySelector("#searchInput"),
  regionFilter: document.querySelector("#regionFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  sortSelect: document.querySelector("#sortSelect"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  resetButton: document.querySelector("#resetButton"),
  resultCount: document.querySelector("#resultCount"),
  gardenGrid: document.querySelector("#gardenGrid"),
};

let state = loadState();

function seasonRecord(gardenId) {
  return state.visited[gardenId] ?? {};
}

function progressFor(gardenId) {
  const record = seasonRecord(gardenId);
  return SEASONS.filter((season) => record[season.key]).length;
}

function matchesSearch(garden, query) {
  if (!query) return true;
  const haystack = [
    garden.name,
    garden.prefecture,
    garden.region,
    garden.type,
    ...garden.tags,
  ].join(" ");
  return haystack.toLowerCase().includes(query.toLowerCase());
}

function matchesStatus(garden, status) {
  const progress = progressFor(garden.id);
  if (status === "complete") return progress === SEASONS.length;
  if (status === "visited") return progress > 0;
  if (status === "incomplete") return progress < SEASONS.length;
  return true;
}

function filteredGardens() {
  const query = elements.searchInput.value.trim();
  const region = elements.regionFilter.value;
  const status = elements.statusFilter.value;
  const sort = elements.sortSelect.value;

  return GARDENS.filter((garden) => (region === "all" ? true : garden.region === region))
    .filter((garden) => matchesSearch(garden, query))
    .filter((garden) => matchesStatus(garden, status))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "ja");
      if (sort === "progress") return progressFor(b.id) - progressFor(a.id) || a.name.localeCompare(b.name, "ja");
      return REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region) || a.prefecture.localeCompare(b.prefecture, "ja") || a.name.localeCompare(b.name, "ja");
    });
}

function renderRegionFilter() {
  const options = ["all", ...REGION_ORDER.filter((region) => GARDENS.some((garden) => garden.region === region))];
  elements.regionFilter.replaceChildren(
    ...options.map((region) => {
      const option = document.createElement("option");
      option.value = region;
      option.textContent = region === "all" ? "全国" : region;
      return option;
    }),
  );
}

function renderSummary() {
  const visitedSeasonCount = GARDENS.reduce((sum, garden) => sum + progressFor(garden.id), 0);
  const completeGardenCount = GARDENS.filter((garden) => progressFor(garden.id) === SEASONS.length).length;
  elements.summaryGardens.textContent = String(GARDENS.length);
  elements.summarySeasons.textContent = `${visitedSeasonCount}/${GARDENS.length * SEASONS.length}`;
  elements.summaryComplete.textContent = String(completeGardenCount);
}

function gardenCard(garden) {
  const template = document.createElement("article");
  const progress = progressFor(garden.id);
  const record = seasonRecord(garden.id);
  template.className = `garden-card${progress === SEASONS.length ? " garden-card--complete" : ""}`;
  template.innerHTML = `
    <div class="garden-card__header">
      <div>
        <p class="garden-card__meta">${garden.region} / ${garden.prefecture}</p>
        <h2>${garden.name}</h2>
      </div>
      <span class="garden-card__progress">${progress}/${SEASONS.length}</span>
    </div>
    <p class="garden-card__type">${garden.type}</p>
    <div class="tag-list">${garden.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    <div class="season-row" aria-label="${garden.name}の季節記録">
      ${SEASONS.map((season) => `
        <button
          class="season-button season-button--${season.key}${record[season.key] ? " is-visited" : ""}"
          type="button"
          data-garden-id="${garden.id}"
          data-season="${season.key}"
          aria-pressed="${record[season.key] ? "true" : "false"}"
        >
          <strong>${season.label}</strong>
          <small>${season.note}</small>
        </button>
      `).join("")}
    </div>
    <a class="garden-card__link" href="${garden.url}" target="_blank" rel="noreferrer">公式情報を見る</a>
  `;
  return template;
}

function renderGardens() {
  const gardens = filteredGardens();
  elements.resultCount.textContent = `${gardens.length}件を表示中`;
  elements.gardenGrid.replaceChildren(...gardens.map(gardenCard));
}

function render() {
  renderSummary();
  renderGardens();
}

function toggleSeason(gardenId, seasonKey) {
  const current = seasonRecord(gardenId);
  state = saveState({
    ...state,
    visited: {
      ...state.visited,
      [gardenId]: {
        ...current,
        [seasonKey]: !current[seasonKey],
      },
    },
  });
  render();
}

function downloadBackup() {
  const blob = new Blob([serializeState(state)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  anchor.href = url;
  anchor.download = `botanic-garden-records-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function bindEvents() {
  for (const element of [elements.searchInput, elements.regionFilter, elements.statusFilter, elements.sortSelect]) {
    element.addEventListener("input", render);
  }

  elements.gardenGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-garden-id][data-season]");
    if (!button) return;
    toggleSeason(button.dataset.gardenId, button.dataset.season);
  });

  elements.exportButton.addEventListener("click", downloadBackup);

  elements.importInput.addEventListener("change", async () => {
    const file = elements.importInput.files?.[0];
    if (!file) return;
    try {
      state = saveState(parseImportedState(await file.text()));
      render();
      alert("記録を読み込みました。");
    } catch (error) {
      alert(error instanceof Error ? error.message : "記録を読み込めませんでした。");
    } finally {
      elements.importInput.value = "";
    }
  });

  elements.resetButton.addEventListener("click", () => {
    if (!confirm("このブラウザに保存した訪問記録をすべて削除します。よろしいですか？")) {
      return;
    }
    state = clearState();
    render();
  });
}

renderRegionFilter();
bindEvents();
render();
