import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms", "/jobs/open", "/profile/"],
        disallow: ["/api/", "/dashboard/", "/onboarding/", "/select/", "/setting/", "/room/", "/jobs/create/", "/jobs/edit/"],
      },
    ],
    sitemap: "https://freelancebase.mohitjoe.xyz/sitemap.xml",
  };
}
