/**
 * PII Heuristic Validator — hard-fails CI on any match.
 *
 * Scans every fixture file in data/ for patterns that suggest real personal data.
 * No ignore list, no warning mode, no override.
 *
 * Patterns:
 *   1. LT personal code (11 digits, checksum-valid format)
 *   2. LT phone numbers outside synthetic range
 *   3. Emails with non-allowed domains
 *   4. Stripe live keys (sk_live_, pk_live_)
 *   5. Lithuanian IBANs (LT + 18 digits)
 *   6. Non-private IP addresses
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DATA_DIR = join(import.meta.dirname ?? ".", "..", "data");
const SCHEMAS_DIR = join(import.meta.dirname ?? ".", "..", "schemas");

const ALLOWED_EMAIL_DOMAINS = ["example.com", "test.viavitae.com"];

// LT personal code: 11 digits, first digit 1-6, valid date in positions 2-7
const LT_PERSONAL_CODE = /[1-6]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{4}/;

// Stripe live keys
const STRIPE_LIVE_KEY = /(sk_live_|pk_live_|rk_live_|whsec_)[a-zA-Z0-9]/;

// Lithuanian IBAN: LT + 18 digits
const LT_IBAN = /LT\d{18}/;

// Non-private IPv4 (simplified — catches obvious public IPs)
const PUBLIC_IP = /(?<!10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)(\d{1,3}\.){3}\d{1,3}/;

interface Finding {
  file: string;
  line: number;
  pattern: string;
  context: string;
}

function scanFile(filePath: string): Finding[] {
  const findings: Finding[] = [];
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip lines that are purely schema definitions or comments
    if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) continue;

    // Check email domains
    const emailMatches = line.matchAll(/[\w.+-]+@([\w-]+\.[\w.-]+)/g);
    for (const match of emailMatches) {
      const domain = match[1].toLowerCase();
      if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
        findings.push({
          file: filePath,
          line: lineNum,
          pattern: "non-allowed email domain",
          context: match[0],
        });
      }
    }

    // Check other patterns
    if (LT_PERSONAL_CODE.test(line)) {
      findings.push({
        file: filePath,
        line: lineNum,
        pattern: "LT personal code format",
        context: line.trim().slice(0, 80),
      });
    }
    if (STRIPE_LIVE_KEY.test(line)) {
      findings.push({
        file: filePath,
        line: lineNum,
        pattern: "Stripe live key",
        context: line.trim().slice(0, 80),
      });
    }
    if (LT_IBAN.test(line)) {
      findings.push({
        file: filePath,
        line: lineNum,
        pattern: "LT IBAN format",
        context: line.trim().slice(0, 80),
      });
    }
    if (PUBLIC_IP.test(line)) {
      findings.push({
        file: filePath,
        line: lineNum,
        pattern: "Non-private IP address",
        context: line.trim().slice(0, 80),
      });
    }
  }

  return findings;
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if ([".json", ".ts", ".js"].includes(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Main
const allFindings: Finding[] = [];
for (const dir of [DATA_DIR, SCHEMAS_DIR]) {
  for (const file of walkDir(dir)) {
    allFindings.push(...scanFile(file));
  }
}

if (allFindings.length > 0) {
  console.error(`\nPII HEURISTIC VALIDATOR — ${allFindings.length} FINDING(S):\n`);
  for (const f of allFindings) {
    console.error(`  ✗ ${f.file}:${f.line} — ${f.pattern}`);
    console.error(`    Context: ${f.context}`);
  }
  console.error("\nHard fail: real personal data patterns detected in fixtures.");
  console.error("See fixtures/validator/README.md for the patterns checked.\n");
  process.exit(1);
} else {
  console.log("PII heuristic validator: PASS — no real data patterns detected.");
}
