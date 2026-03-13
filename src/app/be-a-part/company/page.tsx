import About from "./_components/About";
import Benefits from "./_components/Benefits";
import Change from "./_components/Change";
import Contact from "./_components/Contact";
import Hero from "./_components/Hero";
import Mission from "./_components/Mission";
import Partners from "./_components/Partners";
import Success from "./_components/Success";

const page = () => {
  return (
    <div className="bg-mulearn-whitish min-h-screen ">
      <Hero />
      <About />
      <Benefits />
      <Partners />
      <Success />
      <Mission />
      <Change />
      <Contact />
    </div>
  );
};

export default page;
