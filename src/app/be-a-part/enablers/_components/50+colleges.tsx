export default function FiftyPlusColleges() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col items-center gap-10">
        {/* Heading */}
        <div className="text-center">
          <span className="text-black text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
            Over 50+ Colleges are
          </span>
          <span className="text-blue-500 text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
            {" "}
            µLearn
          </span>
          <span className="text-gray-900 text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
            ified
          </span>
        </div>

        {/* Scroll row + gradient fades */}
        <div className="relative w-full overflow-hidden">
          {/* Scrollable cards row */}
          <div
            className="flex justify-start items-center gap-9 overflow-x-auto px-4 py-6"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" } as React.CSSProperties}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-20 h-20 bg-white rounded-3xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden"
              >
                {/* Placeholder college logo frame */}
                <div className="w-10 h-10 flex items-center justify-center">
                  <div className="w-9 h-9 border-[3px] border-gray-300 rounded-sm" />
                </div>
              </div>
            ))}
          </div>

          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
