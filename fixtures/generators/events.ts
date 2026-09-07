/**
 * Generate synthetic webhook payloads for Stripe, Paysera and Bitrix24.
 * All payloads are test-mode only — no live keys, no real transactions.
 */
import type { Faker } from "@faker-js/faker";

export function generateWebhooks(faker: Faker) {
  const stripe = {
    id: `evt_test_${faker.string.alphanumeric(24)}`,
    object: "event" as const,
    type: "payment_intent.succeeded" as const,
    data: {
      object: {
        id: `pi_test_${faker.string.alphanumeric(24)}`,
        amount: faker.number.int({ min: 1000, max: 50000 }),
        currency: "eur" as const,
        status: "succeeded" as const,
        metadata: {
          parish_id: "parish_test01",
          donor_id: "donor_test01",
        },
      },
    },
  };

  const paysera = {
    orderid: `TEST-${faker.string.alphanumeric(10)}`,
    status: "1",
    amount: String(faker.number.int({ min: 500, max: 25000 })),
    currency: "EUR" as const,
    test: "1" as const,
    sign: faker.string.alphanumeric(128),
  };

  const bitrix24 = {
    event: "ONCRMLEADADD" as const,
    data: {
      FIELDS: {
        ID: String(faker.number.int({ min: 1000, max: 99999 })),
        TITLE: `Naujas donoras: ${faker.person.firstName()} ${faker.person.lastName()}`,
        NAME: faker.person.firstName(),
        STATUS_ID: "NEW",
      },
    },
    ts: faker.date.recent().toISOString(),
  };

  return { stripe, paysera, bitrix24 };
}
