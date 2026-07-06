import { GARDENS, REGION_ORDER, SEASONS } from "../src/data/gardens.js";
import { parseImportedState, serializeState } from "../src/storage.js";

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

console.log(`PASS: validated ${GARDENS.length} gardens, ${SEASONS.length} seasons, and storage imports.`);
