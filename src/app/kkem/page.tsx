import IGAbout from "./_components/IGAbout";
import IGSection from "./_components/IGSection";
import IGEvents from "./_components/IGEvents";
import { kkem } from "@/data/kkem";
import { interestGroups } from "@/data/lc-ig"

export default function Landing() {
  return (
    <>
      <div className="max-w-800">
        <IGAbout />
        <IGSection cards={interestGroups} />
        <div id="events">
          <IGEvents
            cards={kkem.pastEventCardData}
            heading="Partnered Events"
            largeImg={true}
          />
        </div>
      </div>
    </>
  );
}
