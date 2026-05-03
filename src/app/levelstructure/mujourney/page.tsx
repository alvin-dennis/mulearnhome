import Level1Section from "../_components/Level1Section";
import Level2Section from "../_components/Level2Section";
import Level3Section from "../_components/Level3Section";
import Level4Section from "../_components/Level4Section";
import Level5Section from "../_components/Level5Section";
import Level6Section from "../_components/Level6Section";
import Level7Section from "../_components/Level7Section";

export default function MuJourneyPage() {
  return (
    <main className="min-h-screen w-full bg-mulearn-whitish relative z-50 overflow-x-hidden">
      <Level1Section />
      <Level2Section />
      <Level3Section />
      <Level4Section />
      <Level5Section />
      <Level6Section />
      <Level7Section />
    </main>
  );
}
