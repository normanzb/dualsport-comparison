import { overall } from "@/data/abilities";
import { bikes } from "@/data/bikes";
const top = [...bikes].sort((a, b) => overall(b) - overall(a)).slice(0, 5);
console.log("raw overall (the chip and crown rank on the value rounded to 1 dp):");
for (const b of top)
  console.log(`  ${(b.model + " " + (b.year ?? "")).trim().padEnd(22)} raw ${(overall(b) * 10).toFixed(4)}   shown ${(overall(b) * 10).toFixed(1)}`);
const gap = (overall(top[1]) - overall(top[2])) * 10;
console.log(`\ngap between the two tied bikes: ${gap.toFixed(4)} points`);
