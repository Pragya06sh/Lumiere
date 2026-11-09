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
  console.log("🌱 Starting safe seed: keeping real users, orders, and reviews intact...");

  // 1. Upsert Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      festiveMode: true,
      freeShippingThreshold: siteConfig.shipping.freeShippingThreshold,
      codFee: siteConfig.shipping.codFee,
    },
    create: {
      id: "default",
      festiveMode: true,
      announcementActive: true,
      announcementText:
        "🪔 DIWALI SALE: Flat 20% off with code DIWALI20 | Free Delivery above ₹799",
      freeShippingThreshold: siteConfig.shipping.freeShippingThreshold,
      codFee: siteConfig.shipping.codFee,
    },
  });
  console.log("✅ Site settings ready");

  // 2. Upsert Categories
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categoryMap.set(cat.slug, upserted.id);
  }
  console.log(`✅ ${categories.length} Categories synced`);

  // 3. Upsert Collections
  const collectionMap = new Map<string, string>();
  for (const col of collections) {
    const upserted = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {
        name: col.name,
        description: col.description,
        isFeatured: col.isFeatured,
      },
      create: {
        name: col.name,
        slug: col.slug,
        description: col.description,
        isFeatured: col.isFeatured,
      },
    });
    collectionMap.set(col.slug, upserted.id);
  }
  console.log(`✅ ${collections.length} Collections synced`);

  // 4. Upsert Coupons
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {
        type: c.type,
        value: c.value,
        minOrder: c.minOrder,
        maxDiscount: c.maxDiscount,
        usageLimit: c.usageLimit,
        expiresAt: c.expiresAt,
        isActive: true,
      },
      create: {
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
  console.log(`✅ ${coupons.length} Coupons synced`);

  // 5. Upsert Serviceable Pincodes
  for (const p of serviceablePincodes) {
    await prisma.serviceablePincode.upsert({
      where: { pincode: p.pincode },
      update: {
        city: p.city,
        state: p.state,
        deliveryDays: p.deliveryDays,
        codAvailable: p.codAvailable,
      },
      create: {
        pincode: p.pincode,
        city: p.city,
        state: p.state,
        deliveryDays: p.deliveryDays,
        codAvailable: p.codAvailable,
      },
    });
  }
  console.log(`✅ ${serviceablePincodes.length} Pincodes synced`);

  // 6. Upsert Products & Variants safely
  for (const p of products) {
    const productRecord = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
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
        isSignature: p.isSignature ?? false,
        burnHoursEstimate: p.burnHoursEstimate ?? null,
        revealHoursEstimate: p.revealHoursEstimate ?? null,
        hasSurpriseGift: p.hasSurpriseGift,
        giftTier: p.giftTier ?? null,
        giftDescriptionInternal: p.giftDescriptionInternal ?? null,
        giftItemsHer: (p.giftItemsHer ?? null) as any,
        giftItemsHim: (p.giftItemsHim ?? null) as any,
        giftItemsAnyone: (p.giftItemsAnyone ?? null) as any,
      },
      create: {
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
        isSignature: p.isSignature ?? false,
        burnHoursEstimate: p.burnHoursEstimate ?? null,
        revealHoursEstimate: p.revealHoursEstimate ?? null,
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
      },
    });

    // Variants: upsert by SKU
    for (const v of p.variants) {
      await prisma.variant.upsert({
        where: { sku: v.sku },
        update: {
          name: v.name,
          price: v.price,
          compareAt: v.compareAt,
          isDefault: v.isDefault,
        },
        create: {
          productId: productRecord.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compareAt: v.compareAt,
          stock: v.stock,
          isDefault: v.isDefault,
        },
      });
    }

    // Images: sync
    await prisma.productImage.deleteMany({
      where: { productId: productRecord.id },
    });
    for (let idx = 0; idx < p.images.length; idx++) {
      const img = p.images[idx];
      await prisma.productImage.create({
        data: {
          productId: productRecord.id,
          url: img.url,
          alt: img.alt,
          position: idx,
        },
      });
    }

    // Link Categories
    for (const catSlug of p.category) {
      const catId = categoryMap.get(catSlug);
      if (catId) {
        await prisma.productCategory.upsert({
          where: {
            productId_categoryId: {
              productId: productRecord.id,
              categoryId: catId,
            },
          },
          update: {},
          create: {
            productId: productRecord.id,
            categoryId: catId,
          },
        });
      }
    }

    // Link Collections
    for (const colSlug of p.collections) {
      const colId = collectionMap.get(colSlug);
      if (colId) {
        await prisma.productCollection.upsert({
          where: {
            productId_collectionId: {
              productId: productRecord.id,
              collectionId: colId,
            },
          },
          update: {},
          create: {
            productId: productRecord.id,
            collectionId: colId,
          },
        });
      }
    }
  }
  console.log(`✅ ${products.length} Products safely synced`);

  console.log("✨ Seed completed safely! Real users, orders, and reviews are 100% preserved.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
