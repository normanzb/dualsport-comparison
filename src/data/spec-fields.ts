import { type Bike, travelOf, travelSort, wheelSort, wheelsOf } from "@/data/bikes";

export type SpecField = {
  key: string;
  label: string;
  cell: (b: Bike) => string;
  /** false keeps a field out of the table and in the panel's list only */
  inTable?: boolean;
  /** null sorts last whichever way the column is pointing */
  sort: (b: Bike) => number | string | null;
};

/** The specification sheet, shared by the table's columns and the panel's list. */
export const SPEC_FIELDS: SpecField[] = [
  {
    key: "service",
    label: "Service interval",
    cell: (b) => b.spec.serviceInterval,
    sort: (b) => b.n.serviceMi,
  },
  { key: "dry", label: "Dry / no-fuel", cell: (b) => b.spec.dryWeight, sort: (b) => b.n.dryKg },
  { key: "wet", label: "Wet / kerb", cell: (b) => b.spec.wetWeight, sort: (b) => b.n.wetKg },
  { key: "tank", label: "Tank", cell: (b) => b.spec.tank, sort: (b) => b.n.tankL },
  { key: "gears", label: "Gears", cell: (b) => b.spec.gears, sort: (b) => Number(b.spec.gears) },
  { key: "seat", label: "Seat height", cell: (b) => b.spec.seatHeight, sort: (b) => b.n.seatMm },
  {
    key: "clearance",
    label: "Clearance",
    cell: (b) => b.spec.clearance,
    sort: (b) => b.n.clearanceMm,
  },
  {
    key: "travel",
    label: "Suspension travel",
    cell: (b) => travelOf(b.slug),
    sort: (b) => travelSort(b.slug),
    inTable: false,
  },
  { key: "wheels", label: "Wheels", cell: (b) => wheelsOf(b.slug), sort: (b) => wheelSort(b.slug) },
  { key: "engine", label: "Engine", cell: (b) => b.spec.engine, sort: (b) => b.n.cc },
  { key: "power", label: "Power", cell: (b) => b.spec.power, sort: (b) => b.n.hp },
  { key: "torque", label: "Torque", cell: (b) => b.spec.torque, sort: (b) => b.n.nm },
  {
    key: "price",
    label: "Typical UK price",
    cell: (b) => b.spec.price,
    sort: (b) => b.n.priceFrom,
  },
];

export const TABLE_FIELDS = SPEC_FIELDS.filter((f) => f.inTable !== false);

export const specField = (key: string) => SPEC_FIELDS.find((f) => f.key === key) as SpecField;
