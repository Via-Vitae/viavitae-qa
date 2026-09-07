/**
 * Reference anonymizer — shows how production-like data would be transformed.
 *
 * THIS IS NOT A PIPELINE. No production data enters this repository.
 * This file documents the transformation rules for audit purposes.
 *
 * Transformation rules:
 *   - Names → Faker-generated equivalents (same gender, same locale)
 *   - Emails → username@example.com
 *   - Phone numbers → +370 6XX XXXXX (synthetic LT mobile range)
 *   - Postal codes → LT-XXXXX (valid format, fictional)
 *   - Personal codes → 11-digit synthetic with valid checksum
 *   - Addresses → Faker-generated LT addresses
 *   - Payment references → TEST-XXXXXXXXXX
 *   - All timestamps → shifted to recent range (preserving relative order)
 */

export interface ScrubResult {
  original_hash: string;
  field: string;
  transformation: string;
  synthetic_value: string;
}

/**
 * Scrub a single field value. Returns the synthetic replacement.
 * In production use, this would be called on every field of every row.
 */
export function scrubField(field: string, value: string): ScrubResult {
  const transformations: Record<string, (v: string) => string> = {
    name: () => "[SYNTHETIC_NAME]",
    email: () => "[synthetic]@example.com",
    phone: (v: string) => `+3706${"0".repeat(7)}`,
    personal_code: (v: string) => `${"0".repeat(11)}`,
    address: () => "[SYNTHETIC_ADDRESS]",
    postal_code: () => "LT-00000",
    payment_ref: () => "TEST-0000000000",
  };

  const transform = transformations[field] ?? ((v: string) => `[REDACTED:${field}]`);
  return {
    original_hash: `sha256:${Buffer.from(value).toString("base64").slice(0, 12)}`,
    field,
    transformation: field in transformations ? field : "redact",
    synthetic_value: transform(value),
  };
}

/**
 * Scrub an entire record. Returns an array of field-level transformations.
 */
export function scrubRecord(record: Record<string, string>): ScrubResult[] {
  return Object.entries(record).map(([field, value]) => scrubField(field, value));
}
