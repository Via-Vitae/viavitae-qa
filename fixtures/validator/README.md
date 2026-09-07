# PII Heuristic Validator

This validator runs in every CI job. It scans every fixture file for patterns that
match real Lithuanian personal data and **hard-fails** on any match. There is no
ignore list, no warning mode, no override.

---

## Patterns checked

### 1. Lithuanian personal code (Asmens kodas)

- **Format:** 11 digits, first digit indicates century (1–1900s, 2–1800s, 3–2000s,
  4–2100s, 5–1900s, 6–1800s).
- **Checksum:** Last digit is a modulo-11 check digit using weights 1,2,3,4,5,6,7,8,9,1.
- **Regex:** `^[1-6]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{4}$`
- **Why it matters:** A valid-format personal code in a fixture strongly suggests real
  data was committed, because Faker does not generate checksum-valid personal codes.

### 2. Lithuanian phone numbers (real ranges)

- **Format:** +370 followed by 7–8 digits.
- **Real mobile prefixes:** 60x, 61x, 62x, 63x, 64x, 65x, 66x, 67x, 68x, 69x.
- **Synthetic range used in fixtures:** +370 6XX XXXXX where XXXXX is Faker-generated.
- **Detection:** Any +370 number NOT matching the fixture generator's output pattern
  is flagged. Specifically, numbers with real operator prefixes followed by subscriber
  numbers that look sequential (e.g. +370 612 34567) are flagged.

### 3. Email addresses matching real domains

- **Allowed in fixtures:** `@example.com`, `@test.viavitae.com`.
- **Flagged:** Any email with a domain that is not in the allowed list. This catches
  accidentally committed real email addresses.

### 4. Stripe live keys

- **Patterns:** `sk_live_`, `pk_live_`, `rk_live_`, `whsec_` (non-test).
- **Detection:** Any string matching these prefixes is a hard fail.

### 5. Generic PII patterns

- **IBAN:** LT followed by 18 digits (real Lithuanian IBAN format).
- **IP addresses:** IPv4 patterns that are not in private ranges (10.x, 172.16-31.x, 192.168.x).

## Running locally

```bash
pnpm --filter @via-vitae/qa-fixtures validate
```

## CI integration

The validator runs as `pnpm test:fixtures` in `ci.yml` and as part of `unit/` tests.
Any match exits with code 1 and prints the file, line, and pattern that matched.
