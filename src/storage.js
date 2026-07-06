import { SEASONS } from "./data/gardens.js";

const STORAGE_KEY = "botanic-garden-records:v1";
const VERSION = 1;
const SEASON_KEYS = SEASONS.map((season) => season.key);

export function createEmptyState() {
  return {
    version: VERSION,
    visited: {},
    updatedAt: new Date().toISOString(),
  };
}

function normalizeSeasonRecord(record) {
  const normalized = {};
  for (const key of SEASON_KEYS) {
    normalized[key] = Boolean(record && record[key]);
  }
  return normalized;
}

export function normalizeState(value) {
  const base = createEmptyState();
  if (!value || typeof value !== "object") {
    return base;
  }

  const visited = {};
  if (value.visited && typeof value.visited === "object" && !Array.isArray(value.visited)) {
    for (const [gardenId, record] of Object.entries(value.visited)) {
      if (/^[a-z0-9-]+$/.test(gardenId)) {
        visited[gardenId] = normalizeSeasonRecord(record);
      }
    }
  }

  return {
    version: VERSION,
    visited,
    updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : base.updatedAt,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return createEmptyState();
  }
}

export function saveState(state) {
  const normalized = {
    ...normalizeState(state),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
  return createEmptyState();
}

export function serializeState(state) {
  return JSON.stringify(normalizeState(state), null, 2);
}

export function parseImportedState(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("JSONとして読み込めませんでした。");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("記録ファイルの形式が正しくありません。");
  }

  if (!parsed.visited || typeof parsed.visited !== "object" || Array.isArray(parsed.visited)) {
    throw new Error("訪問記録が見つかりません。");
  }

  return normalizeState(parsed);
}
