import About from "./components/About";
import Benefits from "./components/Benefits";
import Change from "./components/Change";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Mission from "./components/Mission";
import Partners from "./components/Partners";
import Sucess from "./components/Success";

const page = () => {
  return (
    <div className="bg-mulearn-whitish min-h-screen ">
      <Hero />
      <About />
      <Benefits />
      <Partners />
      <Sucess />
      <Mission />
      <Change />
      <Contact />
    </div>
  );
};

export default page;
