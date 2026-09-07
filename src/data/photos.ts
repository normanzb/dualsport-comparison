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
  "ktm-500-exc-f-2024": {
    views: [
      { side: "right", src: "/bikes/ktm-500-exc-f-2024/right.webp" },
      { side: "left", src: "/bikes/ktm-500-exc-f-2024/left.webp" },
    ],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/enduro/4-stroke/2026-ktm-500-excf.html",
  },
  "ktm-450-exc-f-2024": {
    views: [{ side: "right", src: "/bikes/ktm-450-exc-f-2024/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/enduro.html",
    note: "Six Days edition shown; mechanically the 450 EXC-F.",
  },
  "suzuki-dr-z4s-2025": {
    views: [{ side: "right", src: "/bikes/suzuki-dr-z4s-2025/right.webp" }],
    credit: "Suzuki GB",
    source: "https://bikes.suzuki.co.uk/",
  },
  "ktm-390-enduro-r-2025": {
    views: [
      { side: "left", src: "/bikes/ktm-390-enduro-r-2025/left.webp" },
      { side: "right", src: "/bikes/ktm-390-enduro-r-2025/right.webp" },
    ],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/dual-sport/2026-ktm-390-enduror.html",
  },
  "ktm-390-adventure-r-2025": {
    views: [{ side: "right", src: "/bikes/ktm-390-adventure-r-2025/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source: "https://www.ktm.com/en-gb/models/adventure/2026-ktm-390-adventurer.html",
  },
  "honda-crf300l-2021": {
    views: [{ side: "right", src: "/bikes/honda-crf300l-2021/right.webp" }],
    credit: "Honda",
    source:
      "https://www.honda.co.uk/content/dam/central/motorcycles/colour-picker/adventure/crf300l/crf300l_2025/r-292r_extreme_red/25YM_CRF300L_EXTREME-RED_R-292R_RHS.png",
  },
  "yamaha-tenere-700-2025": {
    views: [
      { side: "right", src: "/bikes/yamaha-tenere-700-2025/right.webp" },
      { side: "left", src: "/bikes/yamaha-tenere-700-2025/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/t-n-r-700/",
  },
  "honda-crf300-rally-2021": {
    views: [{ side: "right", src: "/bikes/honda-crf300-rally-2021/right.webp" }],
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
  "ktm-890-adventure-r-rally-2024": {
    views: [
      { side: "right", src: "/bikes/ktm-890-adventure-r-rally-2024/right.webp" },
      { side: "left", src: "/bikes/ktm-890-adventure-r-rally-2024/left.webp" },
    ],
    credit: "KTM",
    source: "https://www.ktm.com/en-gb/models/adventure/2026-ktm-890-adventurerrally.html",
    note: "2026 studio images. The Red Bull livery is that year's run; the bike is unchanged since the 2024.",
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
  "kove-800x-rally-2023": {
    views: [{ side: "right", src: "/bikes/kove-800x-rally-2023/right.webp" }],
    credit: "Kove Moto UK",
    source: "https://koveuk.com/bikes/800x-rally/",
  },
  "kove-800x-touring-2026": {
    views: [{ side: "right", src: "/bikes/kove-800x-touring-2026/right.webp" }],
    credit: "Kove Moto UK",
    source: "https://koveuk.com/bikes/800x-touring/",
    note: "Shown with the standard three-case luggage set.",
  },
  "kove-800x-pro-2023": {
    views: [{ side: "right", src: "/bikes/kove-800x-pro-2023/right.webp" }],
    credit: "Kove Moto UK",
    source: "https://koveuk.com/bikes/800x-pro/",
  },
  "bmw-r12g-s-2025": {
    views: [{ side: "left", src: "/bikes/bmw-r12g-s-2025/left.webp" }],
    credit: "BMW Motorrad",
    source: "https://www.bmw-motorrad.co.uk/en/models/heritage/r12gs.html",
  },
  "bmw-g450x-2008": {
    views: [
      { side: "left", src: "/bikes/bmw-g450x-2008/left.webp" },
      { side: "right", src: "/bikes/bmw-g450x-2008/right.webp" },
    ],
    credit: "BMW Motorrad",
    source: "https://www.totalmotorcycle.com/photos/2009models/2009-BMW-G450X",
  },
  "bmw-f650gs-dakar-2000": {
    views: [{ side: "left", src: "/bikes/bmw-f650gs-dakar-2000/left.webp" }],
    credit: "BMW Motorrad",
    source: "https://www.bennetts.co.uk/bikesocial/reviews/bikes/bmw/f650gs-dakar-used-review",
  },
  "bmw-f800gs-2007": {
    views: [
      { side: "left", src: "/bikes/bmw-f800gs-2007/left.webp" },
      { side: "right", src: "/bikes/bmw-f800gs-2007/right.webp" },
    ],
    credit: "BMW Motorrad",
    source: "https://www.press.bmwgroup.com/global/photo/detail/P90224430",
    note: "Studio images of the facelifted 2016 bike in GS Trophy trim; BMW published none of the 2007 original.",
  },
  "bmw-g650gs-2011": {
    views: [
      { side: "left", src: "/bikes/bmw-g650gs-2011/left.webp" },
      { side: "right", src: "/bikes/bmw-g650gs-2011/right.webp" },
    ],
    credit: "BMW Motorrad",
    source: "https://www.press.bmwgroup.com/global/photo/detail/P90098416",
  },
  "bmw-g650gs-sertao-2012": {
    views: [
      { side: "left", src: "/bikes/bmw-g650gs-sertao-2012/left.webp" },
      { side: "right", src: "/bikes/bmw-g650gs-sertao-2012/right.webp" },
    ],
    credit: "BMW Motorrad",
    source: "https://www.press.bmwgroup.com/global/photo/detail/P90083472",
  },
  "bmw-f900gs-2024": {
    views: [
      { side: "left", src: "/bikes/bmw-f900gs-2024/left.webp" },
      { side: "right", src: "/bikes/bmw-f900gs-2024/right.webp" },
    ],
    credit: "BMW Motorrad",
    source: "https://www.bmw-motorrad.co.uk/en/models/adventure/f900gs.html",
    note: "Right-side view courtesy of T-Tech Suspension, on a bike wearing an aftermarket silencer.",
  },
  "moto-morini-alltrhike-450-2026": {
    views: [
      { side: "left", src: "/bikes/moto-morini-alltrhike-450-2026/left.webp" },
      { side: "right", src: "/bikes/moto-morini-alltrhike-450-2026/right.webp" },
    ],
    credit: "Moto Morini",
    source: "https://motomorini.eu/model/alltrhike/",
  },
  "rieju-aventura-rally-307-2025": {
    views: [{ side: "right", src: "/bikes/rieju-aventura-rally-307-2025/right.webp" }],
    credit: "Rieju",
    source: "https://rieju.com/gb/off-road/121/602/aventura-rally-307",
  },
  "yamaha-tenere-700-rally-2025": {
    views: [
      { side: "right", src: "/bikes/yamaha-tenere-700-rally-2025/right.webp" },
      { side: "left", src: "/bikes/yamaha-tenere-700-rally-2025/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/t-n-r-700-rally/",
  },
  "yamaha-tenere-700-world-raid-2022": {
    views: [
      { side: "right", src: "/bikes/yamaha-tenere-700-world-raid-2022/right.webp" },
      { side: "left", src: "/bikes/yamaha-tenere-700-world-raid-2022/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/t-n-r-700-world-raid/",
  },
  "yamaha-wr125r-2026": {
    views: [
      { side: "right", src: "/bikes/yamaha-wr125r-2026/right.webp" },
      { side: "left", src: "/bikes/yamaha-wr125r-2026/left.webp" },
    ],
    credit: "Yamaha Motor",
    source: "https://www.yamaha-motor.eu/gb/en/motorcycles/adventure/pdp/wr125r/",
  },
  "honda-crf450l-2019": {
    views: [
      { side: "left", src: "/bikes/honda-crf450l-2019/left.webp" },
      { side: "right", src: "/bikes/honda-crf450l-2019/right.webp" },
    ],
    credit: "Honda",
    // right view is Honda's own studio asset; the left is the older press shot
    source:
      "https://www.honda.co.uk/content/dam/central/motorcycles/colour-picker/off-road/crf450l/crf450l_2019_nv/ered/crf450l_2019_nv_ered.png",
  },
  "ducati-desmo450-eds-2027": {
    views: [
      { side: "right", src: "/bikes/ducati-desmo450-eds-2027/right.webp" },
      { side: "left", src: "/bikes/ducati-desmo450-eds-2027/left.webp" },
      { side: "front", src: "/bikes/ducati-desmo450-eds-2027/front.webp" },
    ],
    credit: "Ducati",
    source:
      "https://images.ctfassets.net/x7j9qwvpvr5s/3jEDT5uRS22eQMEUsmMtxc/07a88194aef5a8934a4fc23c27963329/2026-06-09-Desmo450-EDS-EU-MY27-Model-Preview-1050x650.png",
  },
  "ccm-gp450-2014": {
    views: [
      { side: "right", src: "/bikes/ccm-gp450-2014/right.webp" },
      { side: "left", src: "/bikes/ccm-gp450-2014/left.webp" },
    ],
    credit: "CCM Motorcycles",
    source: "https://www.motorcyclespecs.co.za/model/ccm/CCM%20GP450%20Adventure.htm",
  },
  "ktm-690-enduro-r-2014": {
    views: [{ side: "right", src: "/bikes/ktm-690-enduro-r-2014/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source:
      "https://web.archive.org/web/20170301034704/http://www.ktm.com/globalassets/products-pim-data/ke2-11001/enduro/690-enduro-r2/690-enduro-r-2017/f9775q8/pho_bike_90_re.png",
    note: "2017 studio image, unchanged bodywork across the run. KTM published no left-side view of this generation.",
  },
  "ktm-690-enduro-r-2019": {
    views: [{ side: "right", src: "/bikes/ktm-690-enduro-r-2019/right.webp" }],
    credit: "KTM Sportmotorcycle",
    source:
      "https://web.archive.org/web/20200626132750/https://www.ktm.com/ktmgroup-storage/PHO_BIKE_90_RE_690-enduror-2019-90-re_%23SALL_%23AEPI_%23V1.png",
    note: "KTM published no left-side view of this model year.",
  },
  "ktm-690-enduro-r-2021": {
    views: [
      { side: "right", src: "/bikes/ktm-690-enduro-r-2021/right.webp" },
      { side: "left", src: "/bikes/ktm-690-enduro-r-2021/left.webp" },
    ],
    credit: "KTM Sportmotorcycle",
    source:
      "https://web.archive.org/web/20201206101503/https://www.ktm.com/ktmgroup-storage/PHO_BIKE_90_RE_690enduror-21-90re_%23SALL_%23AEPI_%23V1.jpg",
  },
  "husqvarna-701-enduro-2016": {
    views: [{ side: "right", src: "/bikes/husqvarna-701-enduro-2016/right.webp" }],
    credit: "Husqvarna Motorcycles",
    source:
      "https://web.archive.org/web/20170528180143/http://www.husqvarna-motorcycles.com/globalassets/products-pim-data/ke2-11007/enduro/dual-sport/701-enduro/701-enduro-2016/f2603p1/pho_bike_90_re.png",
    note: "Husqvarna published no left-side view of this generation. The 2017 looks near identical: that update was mechanical.",
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
  "kove-450-rally-2023": {
    views: [{ side: "right", src: "/bikes/kove-450-rally-2023/right.webp" }],
    credit: "Kove Moto UK",
    source: "https://koveuk.com/bikes/450-rally/",
  },
  "husqvarna-norden-901-2022": {
    views: [
      { side: "right", src: "/bikes/husqvarna-norden-901-2022/right.webp" },
      { side: "left", src: "/bikes/husqvarna-norden-901-2022/left.webp" },
    ],
    credit: "Husqvarna Motorcycles",
    source: "https://www.husqvarna-motorcycles.com/en-gb/models/travel/norden-901-2025.html",
    note: "2024 and 2025 studio images; the Norden has not been redesigned since 2022.",
  },
  "husqvarna-norden-901-expedition-2023": {
    views: [{ side: "right", src: "/bikes/husqvarna-norden-901-expedition-2023/right.webp" }],
    credit: "Husqvarna Motorcycles",
    source:
      "https://www.husqvarna-motorcycles.com/en-gb/models/travel/norden-901-expedition-2025.html",
    note: "2025 studio image, panniers fitted as they are sold.",
  },
  "aprilia-tuareg-660-2022": {
    views: [{ side: "right", src: "/bikes/aprilia-tuareg-660-2022/right.webp" }],
    credit: "Aprilia",
    source: "https://www.aprilia.com/gb_EN/models/tuareg/tuareg-660-parallel-twin-4-stroke-2025/",
    note: "2025 studio image; the bodywork was restyled that year, so the 2022 looks slightly different.",
  },
  "aprilia-rx-125-2018": {
    views: [{ side: "right", src: "/bikes/aprilia-rx-125-2018/right.webp" }],
    credit: "Aprilia",
    source: "https://www.aprilia.com/gb_EN/models/rx-125/rx-125-125-4s4v-2025/",
    note: "2025 studio image; the graphics have changed since 2018, the bike has not.",
  },
  "fantic-xef-250-trail-2024": {
    views: [{ side: "right", src: "/bikes/fantic-xef-250-trail-2024/right.webp" }],
    credit: "Fantic Motor",
    source: "https://www.fantic.com/ii-en/moto/enduro/xef-250-trail_m28g3",
    note: "Fantic publish this at 950 px, so it upscales more than the rest of the set.",
  },
  "cfmoto-450mt-2024": {
    views: [{ side: "right", src: "/bikes/cfmoto-450mt-2024/right.webp" }],
    credit: "CFMOTO UK",
    source: "https://www.cfmoto.co.uk/motorcycles/450mt/",
  },
  "voge-300-rally-2023": {
    views: [{ side: "right", src: "/bikes/voge-300-rally-2023/right.webp" }],
    credit: "Voge UK",
    source: "https://vogemotorcycles.com/model/2026-voge-rally-300-1341",
  },
  "ajp-pr7-2017": {
    views: [{ side: "right", src: "/bikes/ajp-pr7-2017/right.webp" }],
    credit: "AJP Motos",
    source: "https://ajpmotos.com/en/bikes/pr7-650-adventure",
  },
  "bmw-hp2-enduro-2005": {
    views: [
      { side: "left", src: "/bikes/bmw-hp2-enduro-2005/left.webp" },
      { side: "right", src: "/bikes/bmw-hp2-enduro-2005/right.webp" },
      { side: "front", src: "/bikes/bmw-hp2-enduro-2005/front.webp" },
    ],
    credit: "BMW AG",
    source: "https://www.press.bmwgroup.com/global/photo/detail/P0018219",
    note: "BMW's own 04/2005 press set: P0018219, P0018213 and P0018220.",
  },
};

/**
 * Every bike opens on its right. Ordering here rather than in the entries means
 * the set cannot drift as views are added: the panel simply shows the first.
 *
 * Sorted once, not per call: the panel holds the chosen side in state, and a
 * fresh array on every render gave it a new set of views to compare against.
 */
const SIDE_ORDER: Side[] = ["right", "left", "front"];

const ordered: Record<string, PhotoSet> = Object.fromEntries(
  Object.entries(photos).map(([slug, set]) => [
    slug,
    {
      ...set,
      views: [...set.views].sort((a, b) => SIDE_ORDER.indexOf(a.side) - SIDE_ORDER.indexOf(b.side)),
    },
  ]),
);

export const photosFor = (slug: string): PhotoSet | undefined => ordered[slug];
