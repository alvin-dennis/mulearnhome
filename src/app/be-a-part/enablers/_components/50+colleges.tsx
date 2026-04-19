import { Card } from "@/components/ui/card";
import LogoLoop from "@/components/ui/LogoLoop";
import { colleges } from "@/data/enablers";

export default function FiftyPlusColleges() {
  const logos = colleges.map((college) => ({
    node: (
      <Card
        variant="hoverable"
        className="w-48 h-48 flex flex-col items-center justify-center shrink-0"
      >
        <div className="relative group mb-3">
          <div className="relative w-20 h-20 rounded-full bg-mulearn flex items-center justify-center overflow-hidden">
            <span className="text-mulearn-whitish font-black text-sm tracking-tight">
              {college.code}
            </span>
          </div>
        </div>
        <span className="text-sm leading-tight font-semibold text-center uppercase tracking-widest px-1">
          {college.title}
        </span>
      </Card>
    ),
    title: college.title,
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <span className="text-5xl font-bold leading-[62.40px]">Over 50+ Colleges are</span>
          <span className="text-mulearn text-5xl font-bold leading-[62.40px]"> µLearn</span>
          <span className="text-5xl font-bold leading-[62.40px]">ified</span>
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
          className="mb-10"
        />
      </div>
    </section>
  );
}
