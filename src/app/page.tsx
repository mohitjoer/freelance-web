import HomeFooter from "@/components/home comp/home footer";
import HomeFeature from "@/components/home comp/homefeature";
import Homeheader from "@/components/home comp/homeheader";
import HomeHero from "@/components/home comp/homehero";


export default function Home() {
  return (
    <div>
      <Homeheader/>
      <HomeHero/>
      <HomeFeature/>
      <div className="bg-gray-900">
        <HomeFooter/>
      </div>
    </div>
  );
}
