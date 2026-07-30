import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const schema = await readJson(new URL("../contracts/airtable-schema.json", import.meta.url));
const router = await readJson(new URL("../contracts/make-router.json", import.meta.url));
const routes = await readJson(new URL("../examples/routes.json", import.meta.url));

const requiredTables = [
  "Intake Queue",
  "Opportunities",
  "Activities",
  "Projects",
  "Delivery Assets",
  "Exceptions",
];
assert.deepEqual(
  schema.tables.map((table) => table.name),
  requiredTables,
  "Airtable table contract changed",
);
for (const table of schema.tables) {
  assert(table.fields.includes(table.primary_field), `${table.name} primary field is missing`);
}

assert.equal(router.active, false, "The public router contract must remain inactive");
assert.deepEqual(router.external_actions, [], "The router must not contain external actions");
assert.equal(router.steps.length, 7, "The router must retain seven ordered stages");
assert.equal(new Set(router.steps.map((step) => step.id)).size, 7, "Router step IDs must be unique");

assert.equal(routes.cases.length, 4, "Four routing examples are required");
assert.equal(new Set(routes.cases.map((item) => item.intake_id)).size, 4, "Intake IDs must be unique");
assert.deepEqual(
  new Set(routes.cases.map((item) => item.expected_route)),
  new Set(["accepted", "duplicate", "invalid", "owner_review"]),
  "The example set must cover every routing outcome",
);
assert(routes.cases.every((item) => item.external_action_performed === false));

console.log("Airtable and Make contracts are valid.");
