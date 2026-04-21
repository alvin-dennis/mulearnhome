import { Card, CardContent } from "@/components/ui/card";
import LogoLoop from "@/components/ui/LogoLoop";
import { enablers } from "@/data/enablers";

export default function FiftyPlusColleges() {
  const logos = enablers.colleges.map((college) => ({
    node: (
      <Card
        key={`${college.title}`}
        className="w-[320px] h-40 shrink-0 flex flex-col border-mulearn/10 bg-linear-to-br from-mulearn-whitish to-mulearn/5"
      >
        <CardContent className="flex items-center justify-center p-3 h-full">
          <p className="text-md font-bold text-center leading-snug">{college.title}</p>
        </CardContent>
      </Card>
    ),
    title: college.title,
  }));

  return (
    <section className="mx-auto max-w-7xl py-10">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <h2 className="text-5xl">
            Over 50+ Colleges are <span className="text-mulearn">µLearn</span>ified
          </h2>
        </div>
        <LogoLoop
          logos={logos}
          speed={60}
          direction="left"
          gap={36}
          logoHeight={100}
          pauseOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="µLearn enabled colleges"
        />
      </div>
    </section>
  );
}
