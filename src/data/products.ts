export interface ProductVariantData {
  name: string;
  sku: string;
  price: number; // in paise
  compareAt?: number;
  stock: number;
  isDefault?: boolean;
}

export interface ScentNotesData {
  top: string[];
  middle: string[];
  base: string[];
}

export interface ProductSeedData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  scentNotes: ScentNotesData;
  burnTime: string;
  waxType: string;
  wickType: string;
  weight: string;
  howToUse: string;
  safetyTips: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  hasSurpriseGift: boolean;
  giftTier?: "MYSTERY" | "CATEGORY_CHOICE" | "PREMIUM";
  giftDescriptionInternal?: string;
  giftStock: number;
  giftStockHer?: number;
  giftStockHim?: number;
  giftStockAnyone?: number;
  giftItemsHer?: string[];
  giftItemsHim?: string[];
  giftItemsAnyone?: string[];
  category: string[];
  collections: string[];
  variants: ProductVariantData[];
  images: Array<{ url: string; alt: string }>;
  contentsList?: {
    classic?: string[];
    grand?: string[];
  };
}

export const products: ProductSeedData[] = [
  // 1. Rose Pearl Reveal
  {
    name: "Rose Pearl Reveal",
    slug: "rose-pearl-reveal",
    tagline: "A delicate bloom veiled in soothing wax and luminescent pearls",
    description:
      "Hand-poured with pure rose fragrance and soft blush soy wax, this tumbler is adorned with natural dried floral petals and shimmering pearls. As the soothing glow warms the vessel, a cherished keepsake emerges from the depths of the wax.",
    scentNotes: {
      top: ["Fresh Rose Petals"],
      middle: ["White Jasmine", "Wild Blossom"],
      base: ["Bourbon Vanilla", "White Musk"],
    },
    burnTime: "35-45 hours",
    waxType: "Soy Blend Wax",
    wickType: "Natural Braided Cotton Wick",
    weight: "150g / 250g",
    howToUse:
      "1. Trim wick to 5mm before every lighting.\n2. Burn for 2-3 hours on first use to establish an even wax pool.\n3. The keepsake is safely encased at the base — extinguish gently before retrieving.",
    safetyTips:
      "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Never leave a burning candle unattended. Keep away from drafts, pets, and children.",
    seoTitle: "Rose Pearl Reveal Candle | Surprise Inside Luxury Candle",
    seoDescription:
      "Hand-poured pink soy wax candle with dried rose petals and pearls, concealing a surprise keepsake inside.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    hasSurpriseGift: true,
    giftTier: "CATEGORY_CHOICE",
    giftDescriptionInternal:
      "Encased metal keepsake pouch at base: choice of earrings, pendant, ring, or coin.",
    giftStock: 100,
    giftStockHer: 35,
    giftStockHim: 25,
    giftStockAnyone: 40,
    giftItemsHer: ["Crystal Floral Stud Earrings", "Silver-Plated Rose Quartz Pendant", "Delicate Gold-Finish Charm Bracelet", "Adjustable Gemstone Ring"],
    giftItemsHim: ["Brass Geometric Keychain", "Matte Black Minimalist Ring", "Braided Leather & Steel Bracelet"],
    giftItemsAnyone: ["Commemorative Silver-Plated Coin", "Embossed Shubh Laxmi Charm", "Artisanal Brass Keepsake Keychain"],
    category: ["surprise-inside", "diwali-gifting"],
    collections: ["surprise-inside", "diwali-gifting", "under-500"],
    variants: [
      {
        name: "150g",
        sku: "RPR-150",
        price: 44900,
        compareAt: 59900,
        stock: 50,
        isDefault: true,
      },
      {
        name: "250g",
        sku: "RPR-250",
        price: 64900,
        compareAt: 84900,
        stock: 50,
      },
    ],
    images: [
      {
        url: "/images/products/rose-pearl-reveal.jpg",
        alt: "Rose Pearl Reveal pink wax candle with dried petals and pearls in clear glass",
      },
    ],
  },

  // 2. Lotus Diya Jar
  {
    name: "Lotus Diya Jar",
    slug: "lotus-diya-jar",
    tagline: "Sacred temple serenity in golden amber glass",
    description:
      "Housed in an exquisite amber glass jar adorned with gold lotus motifs and a rich maroon lid. Infused with auspicious Chandan and royal Kesar, this candle casts a serene festive glow before revealing a precious hidden gift.",
    scentNotes: {
      top: ["Kashmiri Saffron", "Golden Lotus"],
      middle: ["Temple Rose", "Cardamom Pods"],
      base: ["Mysore Sandalwood", "Golden Amber"],
    },
    burnTime: "40-50 hours",
    waxType: "Soy Blend Wax",
    wickType: "Natural Braided Cotton Wick",
    weight: "180g / 300g",
    howToUse:
      "1. Place jar on a stable, heat-safe coaster.\n2. Allow full melt pool to reach jar rim on first burn.\n3. Extinguish gently with jar lid — avoid blowing.",
    safetyTips:
      "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Never leave burning candle unattended. Keep away from drafts.",
    seoTitle: "Lotus Diya Jar Candle | Chandan & Kesar Scented Candle",
    seoDescription:
      "Amber glass jar candle with gold lotus print, Chandan and Kesar fragrance, and hidden keepsake inside.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    hasSurpriseGift: true,
    giftTier: "CATEGORY_CHOICE",
    giftDescriptionInternal:
      "Sealed heat-safe foil keepsake with auspicious coin or pendant.",
    giftStock: 90,
    giftStockHer: 30,
    giftStockHim: 25,
    giftStockAnyone: 35,
    giftItemsHer: ["Golden Lotus Pendant", "Filigree Stud Earrings", "Charm Bracelet"],
    giftItemsHim: ["Brass Geometric Keychain", "Engraved Steel Cufflinks"],
    giftItemsAnyone: ["Shubh Labh Silver-Plated Coin", "Auspicious Brass Diya Charm"],
    category: ["surprise-inside", "diwali-gifting"],
    collections: ["surprise-inside", "diwali-gifting", "under-500"],
    variants: [
      {
        name: "180g",
        sku: "LDJ-180",
        price: 49900,
        compareAt: 64900,
        stock: 45,
        isDefault: true,
      },
      {
        name: "300g",
        sku: "LDJ-300",
        price: 74900,
        compareAt: 99900,
        stock: 45,
      },
    ],
    images: [
      {
        url: "/images/products/lotus-diya-jar.jpg",
        alt: "Lotus Diya Jar candle in amber glass with gold lotus print and maroon lid",
      },
    ],
  },

  // 3. Petal Jewel Box Gel Candle
  {
    name: "Petal Jewel Box Gel Candle",
    slug: "petal-jewel-gel-candle",
    tagline: "Suspended botanicals holding a secret silver treasure",
    description:
      "Crystal-clear artisanal gel encapsulates natural dried blossoms and subtle golden shimmer. At its center rests a hermetically sealed metal keepsake box holding a premium surprise, unveiled as the gentle flame burns low.",
    scentNotes: {
      top: ["Wild Lavender Buds"],
      middle: ["Soothing Chamomile"],
      base: ["Clean White Musk"],
    },
    burnTime: "45-55 hours",
    waxType: "Clear Gel",
    wickType: "Lead-Free Cotton Wick",
    weight: "200ml / 350ml",
    howToUse:
      "1. Place on a solid, heat-safe surface before lighting.\n2. Do not tilt or move while gel wax is molten.\n3. The keepsake sits sealed in the metal box at the bottom — wait until cool to open.",
    safetyTips:
      "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Use on a heat-safe surface. Do not move while burning. Keep dried flowers and decorations away from the flame.",
    seoTitle: "Petal Jewel Box Gel Candle | Clear Floral Candle with Hidden Metal Box",
    seoDescription:
      "Artisanal clear gel candle with suspended botanicals and a sealed metal jewel box holding a premium surprise.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    hasSurpriseGift: true,
    giftTier: "PREMIUM",
    giftDescriptionInternal:
      "Sealed mini metal jewel chest inside containing silver-finish jewelry or collectible coin.",
    giftStock: 80,
    giftStockHer: 30,
    giftStockHim: 20,
    giftStockAnyone: 30,
    giftItemsHer: ["Sterling Silver Plated Pendant", "Crystal Teardrop Earrings", "Zircon Tennis Bracelet"],
    giftItemsHim: ["Titanium Steel Ring", "Engraved Brass Money Clip", "Matte Bracelet"],
    giftItemsAnyone: ["Commemorative 999 Silver-Plated Coin", "Handcrafted Metal Charm"],
    category: ["surprise-inside", "diwali-gifting"],
    collections: ["surprise-inside", "diwali-gifting", "luxury-picks"],
    variants: [
      {
        name: "200ml",
        sku: "PJG-200",
        price: 79900,
        compareAt: 99900,
        stock: 40,
        isDefault: true,
      },
      {
        name: "350ml",
        sku: "PJG-350",
        price: 114900,
        compareAt: 149900,
        stock: 40,
      },
    ],
    images: [
      {
        url: "/images/products/petal-jewel-gel-candle.jpg",
        alt: "Petal Jewel Box Gel Candle in clear glass with dried flowers and a metal box inside",
      },
    ],
  },

  // 4. Espresso Martini Candle
  {
    name: "Espresso Martini Candle",
    slug: "espresso-martini-candle",
    tagline: "Rich roasted coffee notes in a celebratory glass silhouette",
    description:
      "Inspired by lively candlelit gatherings and artisanal roasteries, poured into a classic cocktail glass and topped with real roasted coffee beans. Fills your room with cocoa, dark espresso, and sweet vanilla while safeguarding a hidden mystery gift.",
    scentNotes: {
      top: ["Fresh Roasted Coffee"],
      middle: ["Rich Cocoa Bean", "Warm Caramel"],
      base: ["Creamy Vanilla Mocha"],
    },
    burnTime: "30-40 hours",
    waxType: "Soy Blend Wax",
    wickType: "Natural Braided Cotton Wick",
    weight: "Regular / Large",
    howToUse:
      "1. Place glass on a firm coaster.\n2. Burn until wax pool reaches glass perimeter.\n3. Extinguish gently with a snuffer.",
    safetyTips:
      "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Always burn within sight on a flat surface.",
    seoTitle: "Espresso Martini Candle | Coffee & Vanilla Scented Candle with Surprise",
    seoDescription:
      "Martini glass candle with real coffee beans, rich espresso vanilla aroma, and hidden mystery gift inside.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    hasSurpriseGift: true,
    giftTier: "MYSTERY",
    giftDescriptionInternal:
      "Mystery heat-safe sealed token or keepsake charm at base.",
    giftStock: 75,
    giftStockHer: 25,
    giftStockHim: 25,
    giftStockAnyone: 25,
    giftItemsHer: ["Coffee Bean Silver Pendant", "Delicate Studs"],
    giftItemsHim: ["Espresso Barista Keychain", "Minimalist Steel Ring"],
    giftItemsAnyone: ["Lucky Clover Charm", "Metal Keepsake Coin"],
    category: ["surprise-inside"],
    collections: ["surprise-inside", "under-500"],
    variants: [
      {
        name: "Regular",
        sku: "EMC-REG",
        price: 44900,
        compareAt: 59900,
        stock: 35,
        isDefault: true,
      },
      {
        name: "Large",
        sku: "EMC-LRG",
        price: 64900,
        compareAt: 79900,
        stock: 40,
      },
    ],
    images: [
      {
        url: "/images/products/espresso-martini-candle.jpg",
        alt: "Espresso Martini Candle in cocktail glass topped with real coffee beans",
      },
    ],
  },

  // 5. Raspberry Bubbly Glass Candle
  {
    name: "Raspberry Bubbly Glass Candle",
    slug: "raspberry-bubbly-glass-candle",
    tagline: "Festive effervescence glowing with bright berry sweetness",
    description:
      "Poured in an elegant stemmed wine glass with translucent ruby gel and festive effervescent notes. A sealed heat-safe metal box rests securely at the bottom of the glass away from the wick, preserving your mystery gift until the candle burns down.",
    scentNotes: {
      top: ["Sparkling Raspberry", "Pink Grapefruit"],
      middle: ["Sugared Rose Petals"],
      base: ["Warm Vanilla", "White Musk"],
    },
    burnTime: "30-40 hours",
    waxType: "Clear Gel",
    wickType: "Lead-Free Cotton Wick",
    weight: "Regular / Large",
    howToUse:
      "1. Place stemmed glass on a secure, heat-resistant surface.\n2. Do not relocate while gel wax is warm.\n3. Gift is housed in a heat-safe metal box at the bottom — wait until cool to retrieve.",
    safetyTips:
      "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Use on a heat-safe surface. Do not move while burning. Keep dried flowers and decorations away from the flame.",
    seoTitle: "Raspberry Bubbly Glass Candle | Red Gel Stemmed Glass Candle",
    seoDescription:
      "Red clear gel candle in a stemmed glass with raspberry fruit aroma, red ribbon, and hidden sealed metal surprise box.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    hasSurpriseGift: true,
    giftTier: "MYSTERY",
    giftDescriptionInternal:
      "Sealed heat-safe mini metal box at bottom containing mystery keepsake.",
    giftStock: 70,
    giftStockHer: 25,
    giftStockHim: 20,
    giftStockAnyone: 25,
    giftItemsHer: ["Rose Quartz Drop Charm", "Crystal Stud Earrings"],
    giftItemsHim: ["Steel Geometric Keychain", "Minimalist Ring"],
    giftItemsAnyone: ["Lucky Brass Charm", "Commemorative Token"],
    category: ["surprise-inside"],
    collections: ["surprise-inside", "under-500"],
    variants: [
      {
        name: "Regular",
        sku: "RBG-REG",
        price: 44900,
        compareAt: 59900,
        stock: 35,
        isDefault: true,
      },
      {
        name: "Large",
        sku: "RBG-LRG",
        price: 64900,
        compareAt: 79900,
        stock: 35,
      },
    ],
    images: [
      {
        url: "/images/products/raspberry-bubbly-glass-candle.jpg",
        alt: "Raspberry Bubbly Glass Candle with red clear gel in stemmed glass with raspberry and red ribbon",
      },
    ],
  },

  // 6. Crimson Hearth Jar
  {
    name: "Crimson Hearth Jar",
    slug: "crimson-hearth-jar",
    tagline: "A warming festive glow infused with aromatic spices",
    description:
      "Poured into a deep crimson glass jar that casts a rich, ambient Diwali glow across your home. Infused with sweet orange peel, spicy cinnamon bark, aromatic clove buds, and glowing amber warmth, carrying a sealed mystery gift deep inside.",
    scentNotes: {
      top: ["Sweet Orange Peel"],
      middle: ["Cinnamon Bark", "Spiced Clove"],
      base: ["Warm Golden Amber"],
    },
    burnTime: "35-45 hours",
    waxType: "Soy Blend Wax",
    wickType: "Natural Braided Cotton Wick",
    weight: "150g / 250g",
    howToUse:
      "1. Trim wick to 5mm prior to lighting.\n2. Allow melt pool to reach jar glass edges.\n3. The mystery keepsake is sealed safely at the bottom.",
    safetyTips:
      "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Always burn within sight on a flat surface away from drafts.",
    seoTitle: "Crimson Hearth Jar Candle | Warm Spiced Diwali Candle",
    seoDescription:
      "Deep red glass jar candle with orange, cinnamon, clove, and amber scent, concealing a surprise gift inside.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    hasSurpriseGift: true,
    giftTier: "MYSTERY",
    giftDescriptionInternal:
      "Sealed heat-safe foil pouch at base with festive mystery keepsake.",
    giftStock: 85,
    giftStockHer: 30,
    giftStockHim: 25,
    giftStockAnyone: 30,
    giftItemsHer: ["Gold-Finish Charm", "Pendant", "Ring"],
    giftItemsHim: ["Brass Keychain", "Steel Ring", "Cufflinks"],
    giftItemsAnyone: ["Festive Brass Diya Charm", "Auspicious Coin"],
    category: ["surprise-inside", "diwali-gifting"],
    collections: ["surprise-inside", "diwali-gifting", "under-500"],
    variants: [
      {
        name: "150g",
        sku: "CHJ-150",
        price: 39900,
        compareAt: 54900,
        stock: 40,
        isDefault: true,
      },
      {
        name: "250g",
        sku: "CHJ-250",
        price: 59900,
        compareAt: 74900,
        stock: 45,
      },
    ],
    images: [
      {
        url: "/images/products/crimson-hearth-jar.jpg",
        alt: "Crimson Hearth Jar candle in deep red glass jar burning warmly",
      },
    ],
  },

  // 7. Noir and Gold Leaf Jar
  {
    name: "Noir and Gold Leaf Jar",
    slug: "noir-gold-leaf-jar",
    tagline: "Our luxury signature piece in lustrous noir and beaten gold",
    description:
      "A dramatic festive showpiece poured in high-gloss black glass embellished with hand-applied gold leaf botanical prints. Radiates deep notes of crisp bergamot, creamy Mysore sandalwood, and velvety black amber, concealing your choice of luxury keepsake.",
    scentNotes: {
      top: ["Italian Bergamot"],
      middle: ["Mysore Sandalwood", "Cashmere"],
      base: ["Black Amber", "Rich Musk"],
    },
    burnTime: "45-60 hours",
    waxType: "Soy Blend Wax",
    wickType: "Crackling Wooden Wick",
    weight: "180g / 300g",
    howToUse:
      "1. Ensure wood wick is trimmed to 4mm before lighting.\n2. Allow surface to melt completely across the diameter.\n3. Reveal your chosen luxury keepsake at the conclusion of the burn.",
    safetyTips:
      "The gift is metal, sealed in a heat-safe pouch or box at the bottom, away from the wick. Trim wick to 5mm before lighting. Keep on heat-safe surfaces.",
    seoTitle: "Noir and Gold Leaf Jar Candle | Luxury Black Amber Signature Candle",
    seoDescription:
      "Signature luxury candle in black glossy jar with gold leaf print, Black Amber notes, and hidden luxury gift.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    hasSurpriseGift: true,
    giftTier: "CATEGORY_CHOICE",
    giftDescriptionInternal:
      "High-value luxury keepsake in heat-proof pouch at bottom of signature black jar.",
    giftStock: 80,
    giftStockHer: 30,
    giftStockHim: 25,
    giftStockAnyone: 25,
    giftItemsHer: ["Gold-Plated Minimalist Choker", "Crystal Earrings", "Designer Bracelet"],
    giftItemsHim: ["Engraved Steel Money Clip", "Matte Black Bracelet", "Luxury Cufflinks"],
    giftItemsAnyone: ["999 Pure Silver-Plated Coin", "Solid Brass Monogram Keepsake"],
    category: ["surprise-inside", "diwali-gifting"],
    collections: ["surprise-inside", "diwali-gifting", "luxury-picks"],
    variants: [
      {
        name: "180g",
        sku: "NGL-180",
        price: 59900,
        compareAt: 79900,
        stock: 40,
        isDefault: true,
      },
      {
        name: "300g",
        sku: "NGL-300",
        price: 89900,
        compareAt: 119900,
        stock: 40,
      },
    ],
    images: [
      {
        url: "/images/products/noir-gold-leaf-jar.jpg",
        alt: "Noir and Gold Leaf Jar candle in glossy black glass with gold leaf botanical print on dark marble",
      },
    ],
  },

  // 8. Ribbon Taper Duo
  {
    name: "Ribbon Taper Duo",
    slug: "ribbon-taper-duo",
    tagline: "Sculptural spiraled tapers edged in gilded elegance",
    description:
      "A handcrafted pair of tall taper candles in gentle sage green and warm peach, sculpted with a flowing gold-edged ribbon twist. Designed to elevate festive dinner tables and mantelpieces with fresh green tea and blooming jasmine.",
    scentNotes: {
      top: ["Green Tea Leaves"],
      middle: ["Blooming Jasmine"],
      base: ["Soft Cedarwood"],
    },
    burnTime: "10-12 hours per taper",
    waxType: "Soy Blend Wax",
    wickType: "Pure Cotton Wick",
    weight: "Pair (2 Tapers)",
    howToUse:
      "1. Secure candles firmly in standard taper holders.\n2. Keep away from drafts to ensure an even, dripless burn.\n3. Snuff gently when finished.",
    safetyTips:
      "Remove all paper wrapping before lighting. Burn on a heat-safe surface. Never leave unattended. Ensure tapers are standing upright securely.",
    seoTitle: "Ribbon Taper Duo Candles | Sculptural Green & Peach Tapers",
    seoDescription:
      "Two tall sculptural tapers in sage green and peach with wavy gold-edged ribbon twists and green tea jasmine aroma.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    hasSurpriseGift: false,
    giftStock: 0,
    category: ["taper-and-decor"],
    collections: ["under-500"],
    variants: [
      {
        name: "Pair",
        sku: "RTD-PAIR",
        price: 34900,
        compareAt: 49900,
        stock: 50,
        isDefault: true,
      },
      {
        name: "Pair with brass holders",
        sku: "RTD-BRASS",
        price: 59900,
        compareAt: 79900,
        stock: 35,
      },
    ],
    images: [
      {
        url: "/images/products/ribbon-taper-duo.jpg",
        alt: "Ribbon Taper Duo featuring tall sage green and peach spiraled tapers on brass candle holders",
      },
    ],
  },

  // 9. Sunflower Garden Tray Candle
  {
    name: "Sunflower Garden Tray Candle",
    slug: "sunflower-tray-candle",
    tagline: "A meadow of sunny blooms carved into natural solid wood",
    description:
      "Poured in a rustic hand-carved wooden dough bowl with three cotton wicks and detailed sunflower wax botanicals. Fills large living rooms with sweet honey, citrus zest, and warm vanilla pastry aromas.",
    scentNotes: {
      top: ["Citrus Zest", "Lemon"],
      middle: ["Golden Blossom Honey"],
      base: ["Bourbon Vanilla"],
    },
    burnTime: "40-55 hours",
    waxType: "Pure Soy Blend Wax",
    wickType: "Triple Cotton Wicks",
    weight: "Regular / Large",
    howToUse:
      "1. Light all three wicks simultaneously for an even burn.\n2. Keep wicks trimmed to 5mm.\n3. The wooden tray can be repurposed as home decor after candle is finished.",
    safetyTips:
      "Remove all paper wrapping before lighting. Burn on a heat-safe surface. Never leave unattended. Burn on a heat-resistant tray away from walls.",
    seoTitle: "Sunflower Garden Tray Candle | 3-Wick Wooden Bowl Candle",
    seoDescription:
      "Hand-carved wooden tray candle with triple wicks and sunflower wax botanicals, scented with honey and vanilla.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    hasSurpriseGift: false,
    giftStock: 0,
    category: ["tray-candles", "diwali-gifting"],
    collections: ["diwali-gifting"],
    variants: [
      {
        name: "Regular",
        sku: "SGT-REG",
        price: 59900,
        compareAt: 79900,
        stock: 35,
        isDefault: true,
      },
      {
        name: "Large",
        sku: "SGT-LRG",
        price: 89900,
        compareAt: 119900,
        stock: 35,
      },
    ],
    images: [
      {
        url: "/images/products/sunflower-tray-candle.jpg",
        alt: "Sunflower Garden Tray Candle in wooden bowl with sculpted yellow sunflowers and 3 wicks",
      },
    ],
  },

  // 10. Red Tulip Candle Bouquet
  {
    name: "Red Tulip Candle Bouquet",
    slug: "red-tulip-bouquet",
    tagline: "An everlasting floral bouquet that burns with romantic warmth",
    description:
      "Sculpted red tulip blossoms individually cast in scented wax and arranged in an artisanal florist presentation with white wrap, gold trim, and a crimson ribbon. A heartwarming gift that pairs bouquet beauty with candlelight.",
    scentNotes: {
      top: ["Morning Dew"],
      middle: ["Fresh Red Rose"],
      base: ["White Cedar"],
    },
    burnTime: "6-8 hours per stem",
    waxType: "Soy Wax Blend",
    wickType: "Individual Cotton Wick per stem",
    weight: "5 Stems / 12 Stems",
    howToUse:
      "1. Remove decorative wrapping and ribbon entirely before lighting.\n2. Stand tulip candles upright in heat-safe dishes.\n3. Burn stems together or individually across your home.",
    safetyTips:
      "Remove all paper wrapping before lighting. Burn on a heat-safe surface. Never leave unattended. Ensure tulips stand firmly on heat-safe coasters.",
    seoTitle: "Red Tulip Candle Bouquet | Scented Flower Bouquet Candles",
    seoDescription:
      "Handcrafted red tulip candles arranged in florist paper wrapping, scented with romantic Rose Garden notes.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    hasSurpriseGift: false,
    giftStock: 0,
    category: ["flower-bouquets", "diwali-gifting"],
    collections: ["diwali-gifting"],
    variants: [
      {
        name: "5 stems",
        sku: "RTB-5",
        price: 59900,
        compareAt: 79900,
        stock: 35,
        isDefault: true,
      },
      {
        name: "12 stems",
        sku: "RTB-12",
        price: 129900,
        compareAt: 169900,
        stock: 25,
      },
    ],
    images: [
      {
        url: "/images/products/red-tulip-bouquet.jpg",
        alt: "Red Tulip Candle Bouquet wrapped in white and gold florist presentation with red satin ribbon",
      },
    ],
  },

  // 11. White Tulip Candle Bouquet
  {
    name: "White Tulip Candle Bouquet",
    slug: "white-tulip-bouquet",
    tagline: "Pristine white blooms wrapped in festive maroon and gold",
    description:
      "Pure ivory white tulip candles sculpted in detail and presented in royal maroon florist wrap with gold borders and a shimmering satin bow. Fills the room with comforting fresh linen, soft jasmine, and clean cotton musk.",
    scentNotes: {
      top: ["White Lily"],
      middle: ["Blooming Jasmine"],
      base: ["Cotton Musk"],
    },
    burnTime: "6-8 hours per stem",
    waxType: "Soy Wax Blend",
    wickType: "Individual Cotton Wick per stem",
    weight: "5 Stems / 12 Stems",
    howToUse:
      "1. Remove all presentation paper and bows before lighting.\n2. Set tulip stems on heat-safe candle plates.\n3. Enjoy clean floral aroma across multiple rooms.",
    safetyTips:
      "Remove all paper wrapping before lighting. Burn on a heat-safe surface. Never leave unattended.",
    seoTitle: "White Tulip Candle Bouquet | Hand-Poured Ivory Flower Candles",
    seoDescription:
      "White tulip flower candles presented in maroon and gold wrap with delicate Cotton Blossom fragrance.",
    isPublished: true,
    isFeatured: true,
    isBestseller: false,
    hasSurpriseGift: false,
    giftStock: 0,
    category: ["flower-bouquets", "diwali-gifting"],
    collections: ["diwali-gifting"],
    variants: [
      {
        name: "5 stems",
        sku: "WTB-5",
        price: 59900,
        compareAt: 79900,
        stock: 35,
        isDefault: true,
      },
      {
        name: "12 stems",
        sku: "WTB-12",
        price: 129900,
        compareAt: 169900,
        stock: 25,
      },
    ],
    images: [
      {
        url: "/images/products/white-tulip-bouquet.jpg",
        alt: "White Tulip Candle Bouquet wrapped in royal maroon and gold florist wrap with white ribbon",
      },
    ],
  },

  // 12. Diwali Glow Hamper
  {
    name: "Diwali Glow Hamper",
    slug: "diwali-glow-hamper",
    tagline: "Our complete festive celebration box curated for shared joy",
    description:
      "A luxurious velvet-finish maroon gift box laden with artisanal festive comforts. Curated with two scented jar candles, gourmet chocolates, a mini dried rose bouquet, and luxury accessories to celebrate Diwali in style.",
    scentNotes: {
      top: ["Rose Water Petals"],
      middle: ["Warm Vanilla Pods"],
      base: ["Amber Musk"],
    },
    burnTime: "40 hours per jar candle",
    waxType: "100% Soy Wax Blend",
    wickType: "Natural Cotton Wicks",
    weight: "Classic / Grand Box",
    howToUse:
      "1. Unpack contents from presentation box.\n2. Place candles on heat-safe coasters before lighting.\n3. Enjoy gourmet chocolates and festive aroma.",
    safetyTips:
      "Remove individual items from box before lighting candles. Burn candles on heat-safe surfaces away from combustibles. Never leave burning candles unattended.",
    seoTitle: "Diwali Glow Hamper | Luxury Scented Candle Gift Box",
    seoDescription:
      "Maroon Diwali gift box with 2 scented jar candles, chocolates, dried rose bouquet, notebook, and mug.",
    isPublished: true,
    isFeatured: true,
    isBestseller: true,
    hasSurpriseGift: false,
    giftStock: 0,
    category: ["gift-hampers", "diwali-gifting"],
    collections: ["diwali-gifting", "luxury-picks"],
    contentsList: {
      classic: [
        "2 Scented Glass Jar Candles (Rose & Vanilla)",
        "Box of 6 Handcrafted Gourmet Chocolates",
        "Mini Dried Rose Keepsake Bouquet",
        "Festive Maroon Gift Box with Satin Ribbon",
      ],
      grand: [
        "2 Scented Glass Jar Candles (Rose & Vanilla)",
        "Box of 6 Handcrafted Gourmet Chocolates",
        "Mini Dried Rose Keepsake Bouquet",
        "Gold-Handled Ceramic Coffee Mug",
        "Velvet Hardcover Journal with Bookmark",
        "Luxury Maroon Gift Box with Satin Ribbon & Bow",
      ],
    },
    variants: [
      {
        name: "Classic",
        sku: "DGH-CLS",
        price: 129900,
        compareAt: 159900,
        stock: 30,
        isDefault: true,
      },
      {
        name: "Grand",
        sku: "DGH-GRD",
        price: 199900,
        compareAt: 249900,
        stock: 25,
      },
    ],
    images: [
      {
        url: "/images/products/diwali-glow-hamper.jpg",
        alt: "Diwali Glow Hamper in maroon gift box with 2 jar candles, chocolates, mug, notebook, and rose bouquet",
      },
    ],
  },
];


export interface CategoryData {
  name: string;
  slug: string;
  description: string;
}

export const categories: CategoryData[] = [
  {
    name: "Surprise Inside",
    slug: "surprise-inside",
    description: "Artisanal candles holding a concealed metal keepsake sealed at the base",
  },
  {
    name: "Taper and Decor",
    slug: "taper-and-decor",
    description: "Tall sculptural and spiraled tapers for elegant festive settings",
  },
  {
    name: "Tray Candles",
    slug: "tray-candles",
    description: "Hand-poured wooden dough bowl tray candles with multiple cotton wicks",
  },
  {
    name: "Flower Bouquets",
    slug: "flower-bouquets",
    description: "Everlasting sculpted floral bouquet candles wrapped in florist presentation",
  },
  {
    name: "Gift Hampers",
    slug: "gift-hampers",
    description: "Curated celebration hampers with jar candles, chocolates, and keepsakes",
  },
];

export interface CollectionData {
  name: string;
  slug: string;
  description: string;
  isFeatured: boolean;
}

export const collections: CollectionData[] = [
  {
    name: "Surprise Inside",
    slug: "surprise-inside",
    description: "Candles containing a surprise metal keepsake at the bottom",
    isFeatured: true,
  },
  {
    name: "Diwali Gifting",
    slug: "diwali-gifting",
    description: "Handcrafted centerpieces, festive hampers, and gifting candles",
    isFeatured: true,
  },
  {
    name: "Under Rs 500",
    slug: "under-500",
    description: "Affordable luxury gifts priced under ₹500",
    isFeatured: true,
  },
  {
    name: "Luxury Picks",
    slug: "luxury-picks",
    description: "Our signature luxury statements: Noir & Gold Leaf Jar and Diwali Glow Hamper",
    isFeatured: true,
  },
];

export interface CouponData {
  code: string;
  type: "PERCENTAGE" | "FLAT";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  expiresAt?: Date;
}

export const coupons: CouponData[] = [
  {
    code: "DIWALI20",
    type: "PERCENTAGE",
    value: 20,
    minOrder: 79900,
    maxDiscount: 50000,
    usageLimit: 1000,
    expiresAt: new Date("2026-11-20T23:59:59+05:30"),
  },
  {
    code: "FIRST100",
    type: "FLAT",
    value: 10000,
    minOrder: 49900,
    usageLimit: 500,
    expiresAt: new Date("2026-12-31T23:59:59+05:30"),
  },
  {
    code: "SURPRISE10",
    type: "PERCENTAGE",
    value: 10,
    minOrder: 0,
    usageLimit: 2000,
    expiresAt: new Date("2026-12-31T23:59:59+05:30"),
  },
];

export const serviceablePincodes = [
  { pincode: "700001", city: "Kolkata", state: "West Bengal", deliveryDays: 2, codAvailable: true },
  { pincode: "700016", city: "Kolkata", state: "West Bengal", deliveryDays: 2, codAvailable: true },
  { pincode: "700019", city: "Kolkata", state: "West Bengal", deliveryDays: 2, codAvailable: true },
  { pincode: "700029", city: "Kolkata", state: "West Bengal", deliveryDays: 2, codAvailable: true },
  { pincode: "700091", city: "Kolkata", state: "West Bengal", deliveryDays: 2, codAvailable: true },
  { pincode: "110001", city: "New Delhi", state: "Delhi", deliveryDays: 4, codAvailable: true },
  { pincode: "400001", city: "Mumbai", state: "Maharashtra", deliveryDays: 4, codAvailable: true },
  { pincode: "560001", city: "Bengaluru", state: "Karnataka", deliveryDays: 4, codAvailable: true },
  { pincode: "500001", city: "Hyderabad", state: "Telangana", deliveryDays: 4, codAvailable: true },
  { pincode: "600001", city: "Chennai", state: "Tamil Nadu", deliveryDays: 4, codAvailable: true },
  { pincode: "411001", city: "Pune", state: "Maharashtra", deliveryDays: 4, codAvailable: true },
  { pincode: "302001", city: "Jaipur", state: "Rajasthan", deliveryDays: 5, codAvailable: true },
];
