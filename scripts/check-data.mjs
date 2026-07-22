import { GARDENS, REGION_ORDER, SEASONS } from "../src/data/gardens.js";
import { parseImportedState, serializeState } from "../src/storage.js";
import { existsSync, readFileSync } from "node:fs";

const REQUIRED_IDS = [
  "sakuya-konohana-kan",
  "kyoto-botanical-gardens",
  "jindai-botanical-garden",
  "hakone-wetlands",
  "odawara-flower-garden",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const ids = new Set();
const seasonKeys = SEASONS.map((season) => season.key);

assert(GARDENS.length >= 40, `Expected at least 40 gardens, got ${GARDENS.length}`);
assert(JSON.stringify(seasonKeys) === JSON.stringify(["spring", "summer", "autumn", "winter"]), "Season keys changed unexpectedly");
for (const season of SEASONS) {
  assert(typeof season.stamp === "string" && season.stamp.startsWith("./assets/stamps/"), `${season.key} is missing stamp path`);
}

for (const garden of GARDENS) {
  assert(/^[a-z0-9-]+$/.test(garden.id), `Garden id must be ASCII kebab-case: ${garden.id}`);
  assert(!ids.has(garden.id), `Duplicate garden id: ${garden.id}`);
  ids.add(garden.id);

  for (const field of ["name", "prefecture", "region", "type", "url"]) {
    assert(typeof garden[field] === "string" && garden[field].length > 0, `${garden.id} is missing ${field}`);
  }

  assert(Array.isArray(garden.tags) && garden.tags.length > 0, `${garden.id} needs tags`);
  assert(REGION_ORDER.includes(garden.region), `${garden.id} has unknown region: ${garden.region}`);
}

for (const requiredId of REQUIRED_IDS) {
  assert(ids.has(requiredId), `Missing required garden: ${requiredId}`);
}

const validImport = parseImportedState(JSON.stringify({
  version: 1,
  visited: {
    "kyoto-botanical-gardens": { spring: true, autumn: true },
  },
  updatedAt: "2026-07-06T00:00:00.000Z",
}));

assert(validImport.visited["kyoto-botanical-gardens"].spring === true, "Valid import did not preserve true spring value");
assert(validImport.visited["kyoto-botanical-gardens"].summer === false, "Valid import did not normalize missing summer value");
assert(serializeState(validImport).includes("\"version\": 1"), "Serialized state is missing version");

for (const malformed of ["not-json", "[]", "{\"visited\":[]}"]) {
  let rejected = false;
  try {
    parseImportedState(malformed);
  } catch {
    rejected = true;
  }
  assert(rejected, `Malformed import was accepted: ${malformed}`);
}

const siteUrl = "https://pocket7878.github.io/BotanicGardenRecords/";
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const robots = readFileSync(new URL("../robots.txt", import.meta.url), "utf8");

assert(sitemap.includes(`<loc>${siteUrl}</loc>`), "Sitemap is missing the public site URL");
assert(robots.includes(`Sitemap: ${siteUrl}sitemap.xml`), "robots.txt is missing the sitemap reference");

const indexHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert(indexHtml.includes("植物園四季採集帖｜植物園の訪問記録を残すアプリ"), "Page title is missing the approved visitor-log wording");
assert(indexHtml.includes("訪れた季節を、あなたの標本帳に。"), "Page is missing the approved specimen-book heading");
assert(indexHtml.includes("記録はどこに保存されますか？"), "Page is missing the storage FAQ");
assert(indexHtml.includes("機種変更やブラウザを変えた場合は？"), "Page is missing the transfer FAQ");
assert(indexHtml.includes("四季すべてを記録しなければいけませんか？"), "Page is missing the seasonal-record FAQ");
assert(indexHtml.includes('property="og:image" content="https://pocket7878.github.io/BotanicGardenRecords/assets/ogp.png"'), "Page is missing the OGP image");
assert(indexHtml.includes('property="og:title"'), "Page is missing the OGP title");
assert(indexHtml.includes('property="og:description"'), "Page is missing the OGP description");
assert(indexHtml.includes('property="og:url"'), "Page is missing the OGP URL");
assert(existsSync(new URL("../assets/ogp.png", import.meta.url)), "OGP image file is missing");

console.log(`PASS: validated ${GARDENS.length} gardens, ${SEASONS.length} seasons, and storage imports.`);
