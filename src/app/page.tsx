import HomeFooter from "@/components/home comp/home footer";
import HomeFeature from "@/components/home comp/homefeature";
import Homeheader from "@/components/home comp/homeheader";
import HomeHero from "@/components/home comp/homehero";
import HomeTrust from "@/components/home comp/hometrust";
import HowItWorks from "@/components/home comp/howitworks";
import HomeProblem from "@/components/home comp/homeproblem";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas selection:bg-primary/10 selection:text-primary">
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
