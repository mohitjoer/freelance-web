import { Button } from "../ui/button";

function HomeHero() {
  return (
    <section className="w-full bg-gradient-to-t from-sky-400 via-cyan-400 to-white px-6 py-24 text-white text-center flex flex-col items-center gap-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
        Find the Right Talent, Faster.
      </h1>

      <p className="text-lg sm:text-xl max-w-2xl text-white/90 leading-relaxed">
        Post jobs, receive competitive offers from top freelancers, and hire with confidence — all in one place.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="rounded-full px-8 py-6 bg-gradient-to-bl from-blue-600 to-cyan-400 text-white text-lg font-semibold hover:from-cyan-400 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg">
          Get Started
        </Button>
        <Button className="rounded-full px-8 py-6 bg-white text-sky-600 text-lg font-semibold hover:bg-sky-100 transition-all duration-300 shadow-md hover:shadow-lg">
          Learn More
        </Button>
      </div>
    </section>
  );
}

export default HomeHero;
