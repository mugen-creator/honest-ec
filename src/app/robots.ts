import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/mypage/", "/checkout/", "/cart"],
      },
    ],
    sitemap: "https://maison.k-honest.com/sitemap.xml",
  };
}
