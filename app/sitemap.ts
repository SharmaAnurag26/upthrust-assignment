import type { MetadataRoute } from "next";
import { content } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: content.site.siteUrl, changeFrequency: "monthly", priority: 1 }];
}
