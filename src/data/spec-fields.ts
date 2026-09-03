import type { Bike } from "@/data/bikes";

export type SpecField = {
  label: string;
  cell: (b: Bike) => string;
  /** null sorts last whichever way the column is pointing */
  sort: (b: Bike) => number | string | null;
};

/** The specification sheet, shared by the table's columns and the panel's list. */
export const SPEC_FIELDS: SpecField[] = [
  { label: "Service interval", cell: (b) => b.spec.serviceInterval, sort: (b) => b.n.serviceMi },
  { label: "Dry / no-fuel", cell: (b) => b.spec.dryWeight, sort: (b) => b.n.dryKg },
  { label: "Wet / kerb", cell: (b) => b.spec.wetWeight, sort: (b) => b.n.wetKg },
  { label: "Tank", cell: (b) => b.spec.tank, sort: (b) => b.n.tankL },
  { label: "Gears", cell: (b) => b.spec.gears, sort: (b) => Number(b.spec.gears) },
  { label: "Seat height", cell: (b) => b.spec.seatHeight, sort: (b) => b.n.seatMm },
  { label: "Clearance", cell: (b) => b.spec.clearance, sort: (b) => b.n.clearanceMm },
  { label: "Engine", cell: (b) => b.spec.engine, sort: (b) => b.n.cc },
  { label: "Power", cell: (b) => b.spec.power, sort: (b) => b.n.hp },
  { label: "Torque", cell: (b) => b.spec.torque, sort: (b) => b.n.nm },
  { label: "Typical UK price", cell: (b) => b.spec.price, sort: (b) => b.n.priceFrom },
];
