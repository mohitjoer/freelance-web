import HomeFeature from "@/components/home comp/homefeature";
import Homeheader from "@/components/home comp/homeheader";
import HomeHero from "@/components/home comp/homehero";


export default function Home() {
  return (
    <div>
      <Homeheader/>
      <HomeHero/>
      <HomeFeature/>

    </div>
  );
}
