import HomeFooter from "@/components/home comp/home footer";
import Homeheader from "@/components/home comp/homeheader";
import HomeHero from "@/components/home comp/homehero";
import HomeCategories from "@/components/home comp/homecategories";
import HomeJobs from "@/components/home comp/homejobs";
import HowItWorks from "@/components/home comp/howitworks";
import HomeTrust from "@/components/home comp/hometrust";
import HomeTestimonials from "@/components/home comp/hometestimonials";
import HomeCta from "@/components/home comp/homecta";

// Escape "<" so user content can never break out of the JSON-LD script sink
const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

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

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas selection:bg-primary/10 selection:text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(orgSchema) }}
      />
      <Homeheader/>
      <HomeHero/>
      <HomeCategories/>
      <HomeJobs/>
      <HowItWorks/>
      <HomeTrust/>
      <HomeTestimonials/>
      <HomeCta/>
      <HomeFooter/>
    </div>
  );
}
