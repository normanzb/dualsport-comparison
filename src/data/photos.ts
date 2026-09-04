export type Side = "left" | "right" | "front";
export type View = { side: Side; src: string };
export type PhotoSet = {
  views: View[];
  /** rights holder, shown under the image */
  credit: string;
  source: string;
  /** when the photo is not exactly the model year of the row */
  note?: string;
};

/**
 * Manufacturer studio cutouts, already alpha-transparent, normalised to one
 * canvas so the set reads as a single shoot. Left is the drive/chain side,
 * right is the exhaust side.
 */
export const photos: Record<string, PhotoSet> = {
  "ktm-690-enduro-r-2026": {
    views: [
      { side: "left", src: "/bikes/ktm-690-enduro-r-2026/left.webp" },
      { side: "right", src: "/bikes/ktm-690-enduro-r-2026/right.webp" },
    ],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/dual-sport/2026-ktm-690-enduror.html",
  },
  "husqvarna-701-enduro-2026": {
    views: [
      { side: "left", src: "/bikes/husqvarna-701-enduro-2026/left.webp" },
      { side: "right", src: "/bikes/husqvarna-701-enduro-2026/right.webp" },
    ],
    credit: "Husqvarna Motorcycles",
    source: "https://www.husqvarna-motorcycles.com/en-gb/models/travel/701-enduro-2026.html",
  },
  "ktm-450-exc-f": {
    views: [{ side: "right", src: "/bikes/ktm-450-exc-f/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/enduro.html",
    note: "Six Days edition shown; mechanically the 450 EXC-F.",
  },
  "suzuki-dr-z4s": {
    views: [{ side: "right", src: "/bikes/suzuki-dr-z4s/right.webp" }],
    credit: "Suzuki GB",
    source: "https://bikes.suzuki.co.uk/",
  },
  "ktm-390-enduro-r": {
    views: [
      { side: "left", src: "/bikes/ktm-390-enduro-r/left.webp" },
      { side: "right", src: "/bikes/ktm-390-enduro-r/right.webp" },
    ],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/dual-sport/2026-ktm-390-enduror.html",
  },
  "ktm-390-adventure-r": {
    views: [{ side: "right", src: "/bikes/ktm-390-adventure-r/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/adventure/2026-ktm-390-adventurer.html",
  },
  "honda-crf300l": {
    views: [{ side: "right", src: "/bikes/honda-crf300l/right.webp" }],
    credit: "Honda",
    source:
      "https://www.honda.co.uk/content/dam/central/motorcycles/colour-picker/adventure/crf300l/crf300l_2025/r-292r_extreme_red/25YM_CRF300L_EXTREME-RED_R-292R_RHS.png",
  },
  "yamaha-tenere-700": {
    views: [
      { side: "right", src: "/bikes/yamaha-tenere-700/right.webp" },
      { side: "left", src: "/bikes/yamaha-tenere-700/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/t-n-r-700/",
  },
  "honda-crf300-rally": {
    views: [{ side: "right", src: "/bikes/honda-crf300-rally/right.webp" }],
    credit: "Honda",
    source:
      "https://www.honda.co.uk/content/dam/central/motorcycles/colour-picker/adventure/crf300_rally/crf300_rally_2025/r-292r_extreme_red/25YM_CRF300-Rally_Studio_EXTREME-RED_R-292R_RHS.png",
  },
  "ktm-890-adventure-r-2023": {
    views: [
      { side: "right", src: "/bikes/ktm-890-adventure-r-2023/right.webp" },
      { side: "left", src: "/bikes/ktm-890-adventure-r-2023/left.webp" },
    ],
    credit: "KTM",
    source: "https://www.ktm.com/en-gb/models/adventure/2026-ktm-890-adventurer.html",
    note: "2026 studio images; the bodywork is unchanged since the 2023 redesign.",
  },
  "ktm-790-adventure-2023": {
    views: [
      { side: "left", src: "/bikes/ktm-790-adventure-2023/left.webp" },
      { side: "right", src: "/bikes/ktm-790-adventure-2023/right.webp" },
    ],
    credit: "KTM",
    source: "https://www.ktm.com/en-gb/models/travel/ktm-790-adventure.html",
    note: "2025 studio images; the bodywork is unchanged since the 2023 relaunch.",
  },
  "moto-morini-alltrhike-450": {
    views: [
      { side: "left", src: "/bikes/moto-morini-alltrhike-450/left.webp" },
      { side: "right", src: "/bikes/moto-morini-alltrhike-450/right.webp" },
    ],
    credit: "Moto Morini",
    source: "https://motomorini.eu/model/alltrhike/",
  },
  "rieju-aventura-rally-307": {
    views: [{ side: "right", src: "/bikes/rieju-aventura-rally-307/right.webp" }],
    credit: "Rieju",
    source: "https://rieju.com/gb/off-road/121/602/aventura-rally-307",
  },
  "yamaha-tenere-700-rally": {
    views: [
      { side: "right", src: "/bikes/yamaha-tenere-700-rally/right.webp" },
      { side: "left", src: "/bikes/yamaha-tenere-700-rally/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/t-n-r-700-rally/",
  },
  "yamaha-tenere-700-world-raid": {
    views: [
      { side: "right", src: "/bikes/yamaha-tenere-700-world-raid/right.webp" },
      { side: "left", src: "/bikes/yamaha-tenere-700-world-raid/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/t-n-r-700-world-raid/",
  },
  "yamaha-wr125r": {
    views: [
      { side: "right", src: "/bikes/yamaha-wr125r/right.webp" },
      { side: "left", src: "/bikes/yamaha-wr125r/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/wr125r/",
  },
  "honda-crf450l": {
    views: [
      { side: "left", src: "/bikes/honda-crf450l/left.webp" },
      { side: "right", src: "/bikes/honda-crf450l/right.webp" },
    ],
    credit: "Honda",
    // right view is Honda's own studio asset; the left is the older press shot
    source:
      "https://www.honda.co.uk/content/dam/central/motorcycles/colour-picker/off-road/crf450l/crf450l_2019_nv/ered/crf450l_2019_nv_ered.png",
  },
  "ducati-desmo450-eds": {
    views: [
      { side: "right", src: "/bikes/ducati-desmo450-eds/right.webp" },
      { side: "left", src: "/bikes/ducati-desmo450-eds/left.webp" },
      { side: "front", src: "/bikes/ducati-desmo450-eds/front.webp" },
    ],
    credit: "Ducati",
    source:
      "https://images.ctfassets.net/x7j9qwvpvr5s/3jEDT5uRS22eQMEUsmMtxc/07a88194aef5a8934a4fc23c27963329/2026-06-09-Desmo450-EDS-EU-MY27-Model-Preview-1050x650.png",
  },
  "ccm-gp450": {
    views: [
      { side: "right", src: "/bikes/ccm-gp450/right.webp" },
      { side: "left", src: "/bikes/ccm-gp450/left.webp" },
    ],
    credit: "CCM Motorcycles",
    source: "https://www.motorcyclespecs.co.za/model/ccm/CCM%20GP450%20Adventure.htm",
  },
  "ktm-690-enduro-r-2019": {
    views: [{ side: "right", src: "/bikes/ktm-690-enduro-r-2019/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.motorcyclespecs.co.za/model/ktm/KTM_690_Enduro_R_16.htm",
    note: "2016 studio image; the bodywork changed with the 2019 revision.",
  },
  "ktm-690-enduro-r-2021": {
    views: [{ side: "left", src: "/bikes/ktm-690-enduro-r-2021/left.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.motorcyclespecs.co.za/model/ktm/ktm_690_enduro_r_21.html",
    note: "2021 studio image.",
  },
  "husqvarna-701-enduro-2017": {
    views: [{ side: "right", src: "/bikes/husqvarna-701-enduro-2017/right.webp" }],
    credit: "Husqvarna Motorcycles",
    source:
      "https://web.archive.org/web/20180611212503/http://www.husqvarna-motorcycles.com/at/enduro/701-enduro",
    note: "2018 studio image, the same livery as the 2017. Husqvarna published no left-side view of this generation.",
  },
  "husqvarna-701-enduro-2020": {
    views: [
      { side: "left", src: "/bikes/husqvarna-701-enduro-2020/left.webp" },
      { side: "right", src: "/bikes/husqvarna-701-enduro-2020/right.webp" },
    ],
    credit: "Husqvarna Motorcycles",
    source: "https://www.husqvarna-motorcycles.com/en-gb/models/travel/701-enduro-2022.html",
    note: "2021 studio images; unchanged bodywork from the 2020.",
  },
  "kove-450-rally": {
    views: [{ side: "right", src: "/bikes/kove-450-rally/right.webp" }],
    credit: "Kove Moto UK",
    source: "https://koveuk.com/bikes/450-rally/",
  },
  "cfmoto-450mt": {
    views: [{ side: "right", src: "/bikes/cfmoto-450mt/right.webp" }],
    credit: "CFMOTO UK",
    source: "https://www.cfmoto.co.uk/motorcycles/450mt/",
  },
  "voge-300-rally": {
    views: [{ side: "right", src: "/bikes/voge-300-rally/right.webp" }],
    credit: "Voge UK",
    source: "https://vogemotorcycles.com/model/2026-voge-rally-300-1341",
  },
  "ajp-pr7": {
    views: [{ side: "right", src: "/bikes/ajp-pr7/right.webp" }],
    credit: "AJP Motos",
    source: "https://ajpmotos.com/en/bikes/pr7-650-adventure",
  },
  "bmw-hp2-enduro": {
    views: [
      { side: "left", src: "/bikes/bmw-hp2-enduro/left.webp" },
      { side: "right", src: "/bikes/bmw-hp2-enduro/right.webp" },
    ],
    credit: "BMW Motorrad",
    source: "https://www.motorcyclespecs.co.za/model/bmw/bmw-hp2-enduro-06.html",
    note: "2007 studio images.",
  },
};

/**
 * Every bike opens on its right. Ordering here rather than in the entries means
 * the set cannot drift as views are added: the panel simply shows the first.
 */
const SIDE_ORDER: Side[] = ["right", "left", "front"];

export const photosFor = (slug: string): PhotoSet | undefined => {
  const set = photos[slug];
  if (!set) return undefined;
  return {
    ...set,
    views: [...set.views].sort((a, b) => SIDE_ORDER.indexOf(a.side) - SIDE_ORDER.indexOf(b.side)),
  };
};
