/**
 * Generate 12 fictional parishes with Lithuanian names and fictional priests.
 * All data is synthetic — no real parishes or real clergy.
 */
import type { Faker } from "@faker-js/faker";

export interface Parish {
  id: string;
  name: string;
  diocese: string;
  address: { street: string; city: string; postal_code: string };
  priest: { first_name: string; last_name: string; title: string };
  phone: string;
  email: string;
  active: boolean;
  member_count: number;
}

const DIOCESES = ["vilnius", "kaunas", "siauliai", "panevezys", "telšiai", "vilkaviškis"];
const TITLES = ["kunigas", "monsinjoras", "prelatas"];
const LT_CITIES = [
  "Vilnius",
  "Kaunas",
  "Klaipėda",
  "Šiauliai",
  "Panevėžys",
  "Alytus",
  "Marijampolė",
  "Mažeikiai",
  "Jonava",
  "Utena",
  "Kėdainiai",
  "Telšiai",
];

function randomId(prefix: string): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = prefix + "_";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export function generateParishes(faker: Faker): Parish[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: randomId("parish"),
    name: `${LT_CITIES[i]} Šv. ${faker.person.firstName("male")} parapija`,
    diocese: DIOCESES[i % DIOCESES.length],
    address: {
      street: `${faker.location.street()} ${faker.location.buildingNumber()}`,
      city: LT_CITIES[i],
      postal_code: `LT-${String(faker.number.int({ min: 1000, max: 9999 })).padStart(5, "0")}`,
    },
    priest: {
      first_name: faker.person.firstName("male"),
      last_name: faker.person.lastName("male"),
      title: TITLES[i % TITLES.length],
    },
    phone: `+3706${faker.string.numeric(7)}`,
    email: `parapija.${LT_CITIES[i].toLowerCase().replace(/[^a-z]/g, "")}@test.viavitae.com`,
    active: i < 10,
    member_count: faker.number.int({ min: 50, max: 15000 }),
  }));
}
