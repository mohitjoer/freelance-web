import HomeFooter from "@/components/home comp/home footer";
import HomeFeature from "@/components/home comp/homefeature";
import Homeheader from "@/components/home comp/homeheader";
import HomeHero from "@/components/home comp/homehero";
import HomeTrust from "@/components/home comp/hometrust";
import HowItWorks from "@/components/home comp/howitworks";
import HomeProblem from "@/components/home comp/homeproblem";

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FreelanceBase",
    "url": "https://freelancebase.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://freelancebase.com/jobs/open?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FreelanceBase",
    "url": "https://freelancebase.com",
    "logo": "https://freelancebase.com/favicon.ico",
    "sameAs": [
      "https://twitter.com/freelancebase",
      "https://github.com/mohitjoer/freelance-web"
    ]
  };

  return (
    <div className="min-h-screen bg-canvas selection:bg-primary/10 selection:text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Homeheader/>
      <HomeHero/>
      <HomeFeature/>
      <HomeTrust/>
      <HowItWorks/>
      <HomeProblem/>
      <HomeFooter/>
    </div>
  );
}
