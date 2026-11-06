import { PrismaClient } from "@prisma/client";
import {
  products,
  categories,
  collections,
  coupons,
  serviceablePincodes,
} from "../src/data/products";
import { siteConfig } from "../src/config/site";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed with 12 real products...");

  // 1. Clear old catalog data in reverse order of relations (preserve users and orders)
  await prisma.revealCode.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.serviceablePincode.deleteMany();
  await prisma.siteSettings.deleteMany();

  // 2. Create Site Settings (student-friendly: shipping Rs 49, free shipping above Rs 799, COD Rs 39)
  await prisma.siteSettings.create({
    data: {
      id: "default",
      festiveMode: true,
      announcementActive: true,
      announcementText:
        "🪔 DIWALI SALE: Flat 20% off with code DIWALI20 | Free Delivery above ₹799",
      freeShippingThreshold: siteConfig.shipping.freeShippingThreshold,
      codFee: siteConfig.shipping.codFee,
    },
  });
  console.log("✅ Site settings created (Free delivery above ₹799, COD ₹39)");

  // 3. Ensure Admin User exists
  await prisma.user.upsert({
    where: { email: "admin@lumiere-candles.in" },
    update: {},
    create: {
      name: "Store Administrator",
      email: "admin@lumiere-candles.in",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user ready");

  // 4. Create Categories
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`✅ ${categories.length} Categories created`);

  // 5. Create Collections
  const collectionMap = new Map<string, string>();
  for (const col of collections) {
    const created = await prisma.collection.create({
      data: {
        name: col.name,
        slug: col.slug,
        description: col.description,
        isFeatured: col.isFeatured,
      },
    });
    collectionMap.set(col.slug, created.id);
  }
  console.log(`✅ ${collections.length} Collections created`);

  // 6. Create Coupons
  for (const c of coupons) {
    await prisma.coupon.create({
      data: {
        code: c.code,
        type: c.type,
        value: c.value,
        minOrder: c.minOrder,
        maxDiscount: c.maxDiscount,
        usageLimit: c.usageLimit,
        expiresAt: c.expiresAt,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${coupons.length} Coupons created`);

  // 7. Create Serviceable Pincodes
  await prisma.serviceablePincode.createMany({
    data: serviceablePincodes,
  });
  console.log(`✅ ${serviceablePincodes.length} Pincodes seeded`);

  // 8. Create the 12 Products with Variants, Images, Categories, and Collections
  for (const p of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        scentNotes: p.scentNotes as any,
        burnTime: p.burnTime,
        waxType: p.waxType,
        wickType: p.wickType,
        weight: p.weight,
        howToUse: p.howToUse,
        safetyTips: p.safetyTips,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        isPublished: true,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        hasSurpriseGift: p.hasSurpriseGift,
        giftTier: p.giftTier ?? null,
        giftDescriptionInternal: p.giftDescriptionInternal ?? null,
        giftStock: p.giftStock ?? (p.hasSurpriseGift ? 100 : 0),
        giftStockHer: p.giftStockHer ?? (p.hasSurpriseGift ? 35 : 0),
        giftStockHim: p.giftStockHim ?? (p.hasSurpriseGift ? 25 : 0),
        giftStockAnyone: p.giftStockAnyone ?? (p.hasSurpriseGift ? 40 : 0),
        giftItemsHer: (p.giftItemsHer ?? null) as any,
        giftItemsHim: (p.giftItemsHim ?? null) as any,
        giftItemsAnyone: (p.giftItemsAnyone ?? null) as any,
        variants: {
          create: p.variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            compareAt: v.compareAt,
            stock: v.stock,
            isDefault: v.isDefault,
          })),
        },
        images: {
          create: p.images.map((img, idx) => ({
            url: img.url,
            alt: img.alt,
            position: idx,
          })),
        },
      },
    });

    // Link Categories
    for (const catSlug of p.category) {
      const catId = categoryMap.get(catSlug);
      if (catId) {
        await prisma.productCategory.create({
          data: {
            productId: createdProduct.id,
            categoryId: catId,
          },
        });
      }
    }

    // Link Collections
    for (const colSlug of p.collections) {
      const colId = collectionMap.get(colSlug);
      if (colId) {
        await prisma.productCollection.create({
          data: {
            productId: createdProduct.id,
            collectionId: colId,
          },
        });
      }
    }
  }
  console.log(`✅ ${products.length} Real Products created with relations`);

  console.log("✨ Seed completed successfully! Zero fake reviews, zero fake reveal codes.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
