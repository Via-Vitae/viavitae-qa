/**
 * Generate synthetic donor profiles — zero real people.
 * Emails use @example.com or @test.viavitae.com domains only.
 */
import type { Faker } from "@faker-js/faker";
import type { Parish } from "./parishes.js";

export interface Donor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: { street: string; city: string; postal_code: string; country: string };
  created_at: string;
  total_donated_eur: number;
  donation_count: number;
  recurring: boolean;
  parish_id: string;
}

function randomId(prefix: string): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = prefix + "_";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export function generateDonors(faker: Faker, parishes: Parish[]): Donor[] {
  return Array.from({ length: 50 }, () => {
    const parish = parishes[Math.floor(Math.random() * parishes.length)];
    return {
      id: randomId("donor"),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: `${faker.internet.userName()}@example.com`,
      phone: `+3706${faker.string.numeric(7)}`,
      address: {
        street: `${faker.location.street()} ${faker.location.buildingNumber()}`,
        city: faker.location.city(),
        postal_code: `LT-${String(faker.number.int({ min: 1000, max: 9999 })).padStart(5, "0")}`,
        country: "LT",
      },
      created_at: faker.date.past({ years: 3 }).toISOString(),
      total_donated_eur: faker.number.float({ min: 5, max: 5000, fractionDigits: 2 }),
      donation_count: faker.number.int({ min: 1, max: 48 }),
      recurring: faker.datatype.boolean(),
      parish_id: parish.id,
    };
  });
}
