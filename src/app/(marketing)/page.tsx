import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { Regions } from "@/components/home/regions";
import { FeaturedFirms } from "@/components/home/featured-firms";
import { HowItWorks } from "@/components/home/how-it-works";
import { ToolsSection } from "@/components/home/tools-section";
import { CtaFirm } from "@/components/home/cta-firm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.fullName} | Gebze, Darıca, Çayırova, Dilovası Düğün Rehberi`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid limit={18} />
      <Regions />
      <FeaturedFirms />
      <HowItWorks />
      <ToolsSection />
      <CtaFirm />

      {/* JSON-LD: WebSite + Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${siteConfig.url}/#website`,
                url: siteConfig.url,
                name: siteConfig.fullName,
                description: siteConfig.description,
                inLanguage: "tr-TR",
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${siteConfig.url}/arama?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "Organization",
                "@id": `${siteConfig.url}/#organization`,
                name: siteConfig.fullName,
                url: siteConfig.url,
                logo: `${siteConfig.url}/logo.png`,
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: siteConfig.phone,
                    email: siteConfig.email,
                    contactType: "customer service",
                    areaServed: "TR",
                    availableLanguage: ["Turkish"],
                  },
                ],
                sameAs: [
                  siteConfig.social.instagram,
                  siteConfig.social.facebook,
                  siteConfig.social.youtube,
                ],
              },
            ],
          }),
        }}
      />
    </>
  );
}
