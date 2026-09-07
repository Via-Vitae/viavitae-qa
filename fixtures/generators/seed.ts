/**
 * Deterministic fixture generator — Faker with a FIXED seed.
 *
 * Every run produces byte-identical output. This is intentional: committed fixture
 * data must be stable across CI runs so diffs are meaningful.
 *
 * Usage: pnpm generate
 * Output: data/parishes.json, data/donors.json, data/webhooks/*.json
 */
import { faker } from "@faker-js/faker";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateParishes } from "./parishes.js";
import { generateDonors } from "./donors.js";
import { generateWebhooks } from "./events.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const WEBHOOKS_DIR = join(DATA_DIR, "webhooks");

// FIXED seed — changing this changes ALL fixture data.
// Record the seed value in CHANGELOG if you change it.
const SEED = 42_817;
faker.seed(SEED);

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(WEBHOOKS_DIR, { recursive: true });

const parishes = generateParishes(faker);
writeFileSync(join(DATA_DIR, "parishes.json"), JSON.stringify(parishes, null, 2) + "\n");

const donors = generateDonors(faker, parishes);
writeFileSync(join(DATA_DIR, "donors.json"), JSON.stringify(donors, null, 2) + "\n");

const webhooks = generateWebhooks(faker);
writeFileSync(join(WEBHOOKS_DIR, "stripe-payment-intent.json"), JSON.stringify(webhooks.stripe, null, 2) + "\n");
writeFileSync(join(WEBHOOKS_DIR, "paysera-callback.json"), JSON.stringify(webhooks.paysera, null, 2) + "\n");
writeFileSync(join(WEBHOOKS_DIR, "bitrix24-lead-created.json"), JSON.stringify(webhooks.bitrix24, null, 2) + "\n");

console.log(`Generated fixtures with seed ${SEED}:`);
console.log(`  ${parishes.length} parishes`);
console.log(`  ${donors.length} donors`);
console.log(`  3 webhook payloads`);
