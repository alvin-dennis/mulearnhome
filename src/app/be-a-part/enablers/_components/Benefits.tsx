export default function Benefits() {
  const cards = [
    {
      icon: "/assets/be-a-part/hugeicons_pyramid-structure-02.svg",
      alt: "Structured Framework icon",
      title: "Structured Framework",
      description: "Clear guidelines for smooth chapter functioning.",
    },
    {
      icon: "/assets/be-a-part/community_impact.svg",
      alt: "Community Impact icon",
      title: "Community Impact",
      description:
        "Bridge the gap between education and employment by fueling the next generation of talent.",
    },
    {
      icon: "/assets/be-a-part/campus_impact.svg",
      alt: "Campus Impact icon",
      title: "Campus Impact",
      description:
        "Enable portfolios, projects and student-led initiatives that enhance institution reputation.",
    },
    {
      icon: "/assets/be-a-part/solar_medal-ribbon-broken.svg",
      alt: "Faculty Recognition icon",
      title: "Faculty Recognition",
      description:
        "Enable portfolios, projects and student-led initiatives that enhance institution reputation.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1276px] px-6 py-16 lg:px-8 lg:py-20">
      <div className="w-full flex flex-col items-center gap-5">
        {/* Heading */}
        <div className="self-stretch text-center">
          <span className="text-gray-900 text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
            Benefits of an{" "}
          </span>
          <span className="text-blue-500 text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
            Enabler
          </span>
          <span className="text-gray-900 text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
            ?
          </span>
        </div>

        {/* Cards grid — 1 col on mobile, row on xl */}
        <div className="w-full flex flex-col items-center gap-5 xl:flex-row xl:items-start xl:flex-wrap xl:justify-start">
          {cards.map((card, i) => (
            <div
              key={i}
              className="relative w-full max-w-xs xl:w-72 h-60 p-6 bg-white rounded-2xl outline outline-[1.60px] outline-offset-[-1.60px] outline-gray-300 flex flex-col justify-start items-start gap-5"
            >
              {/* Icon */}
              <div className="w-12 h-12 relative overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.icon} alt={card.alt} className="w-full h-full object-contain" />
              </div>

              {/* Title */}
              <div className="text-blue-500 text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-6">
                {card.title}
              </div>

              {/* Description */}
              <div className="self-stretch text-black text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">
                {card.description}
              </div>

              {/* Sparkle on last card (desktop only) */}
              {i === cards.length - 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  aria-hidden="true"
                  className="hidden xl:block absolute right-[-5px] top-[10px]"
                >
                  <path
                    d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
                    fill="black"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
