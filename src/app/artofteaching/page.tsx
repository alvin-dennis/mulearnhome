import Archives from "./_components/Archives";
import FirstEdition from "./_components/FirstEdition";
import Guidelines from "./_components/Guidelines";
import Hero from "./_components/Hero";
import Judges from "./_components/Judges";

const ArtOfTeaching = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Guidelines />
      <FirstEdition />
      <Judges />
      <Archives />
    </div>
  );
};

export default ArtOfTeaching;
