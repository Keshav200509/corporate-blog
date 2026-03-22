import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "../src/blog/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/preview", "/api/"]
            }
        ],
        sitemap: getCanonicalUrl("/sitemap.xml")
    };
}