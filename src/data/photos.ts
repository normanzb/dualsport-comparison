export type Side = "left" | "right";
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
  "ktm-450-excf": {
    views: [{ side: "right", src: "/bikes/ktm-450-excf/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/enduro.html",
    note: "Six Days edition shown; mechanically the 450 EXC-F.",
  },
  "suzuki-drz4s": {
    views: [{ side: "right", src: "/bikes/suzuki-drz4s/right.webp" }],
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
    source: "https://www.motorcyclespecs.co.za/model/Honda/honda-crf300l-2025.html",
  },
  "yamaha-wr125r": {
    views: [{ side: "right", src: "/bikes/yamaha-wr125r/right.webp" }],
    credit: "Yamaha Motor",
    source: "https://www.motorcyclespecs.co.za/model/yamaha/Yamaha-wr-125r-2026.htm",
  },
  "honda-crf450l": {
    views: [
      { side: "left", src: "/bikes/honda-crf450l/left.webp" },
      { side: "right", src: "/bikes/honda-crf450l/right.webp" },
    ],
    credit: "Honda",
    source: "https://www.motorcyclespecs.co.za/model/Honda/honda_crf450L_20.html",
  },
  "ducati-desmo450-eds": {
    views: [{ side: "right", src: "/bikes/ducati-desmo450-eds/right.webp" }],
    credit: "Ducati",
    source: "https://www.motorcyclespecs.co.za/model/ducati/ducadti-desmo-450eds-2027.html",
  },
  "ccm-gp450": {
    views: [{ side: "right", src: "/bikes/ccm-gp450/right.webp" }],
    credit: "CCM Motorcycles",
    source: "https://www.motorcyclespecs.co.za/model/ccm/CCM%20GP450%20Adventure.htm",
  },
  "ktm-690-enduro-r-2018": {
    views: [{ side: "right", src: "/bikes/ktm-690-enduro-r-2018/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.motorcyclespecs.co.za/model/ktm/KTM_690_Enduro_R_16.htm",
    note: "2016 studio image; same bodywork generation as the 2018.",
  },
  "ktm-690-enduro-r-2025": {
    views: [{ side: "left", src: "/bikes/ktm-690-enduro-r-2025/left.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.motorcyclespecs.co.za/model/ktm/ktm_690_enduro_r_21.html",
    note: "2021 studio image; same generation as the 2025.",
  },
  "husqvarna-701-enduro-2018": {
    views: [{ side: "right", src: "/bikes/husqvarna-701-enduro-2018/right.webp" }],
    credit: "Husqvarna Motorcycles",
    source: "https://www.motorcyclespecs.co.za/model/husqvana/husqvarna_te_710_enduro_17.htm",
  },
  "husqvarna-701-enduro-2025": {
    views: [{ side: "right", src: "/bikes/husqvarna-701-enduro-2025/right.webp" }],
    credit: "Husqvarna Motorcycles",
    source: "https://www.motorcyclespecs.co.za/model/husqvana/husqvarna-701-enduro-2023.html",
    note: "2023 studio image; same generation as the 2025.",
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
};

export const photosFor = (slug: string): PhotoSet | undefined => photos[slug];
