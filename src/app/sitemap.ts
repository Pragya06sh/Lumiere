import { MetadataRoute } from "next";
import { products, categories, collections } from "@/data/products";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/gifting",
    "/track-order",
    "/privacy-policy",
    "/terms",
    "/shipping-policy",
    "/refund-policy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${baseUrl}/shop?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const collectionRoutes = collections
    .filter((col) => !col.slug.toLowerCase().includes("diwali"))
    .map((col) => ({
      url: `${baseUrl}/shop?collection=${col.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...collectionRoutes];
}
