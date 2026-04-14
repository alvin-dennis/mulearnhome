const features = [
  {
    text: "Provide direction and ensure healthy chapter functioning",
    icon: (
      <div className="w-9 h-9 relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/be-a-part/mage_direction-right-2-fill.svg"
          alt="Direction icon"
          className="w-full h-full"
        />
      </div>
    ),
  },
  {
    text: "Guide student leads when needed",
    icon: (
      <div className="w-9 h-9 relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/be-a-part/mdi_help-outline.svg"
          alt="Help icon"
          className="w-full h-full"
        />
      </div>
    ),
  },
  {
    text: "Support a culture of exploration and practical learning",
    icon: (
      <div className="w-9 h-9 relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/be-a-part/Group.svg" alt="Group icon" className="w-full h-full" />
      </div>
    ),
  },
  {
    text: "Facilitate industry or campus-level opportunities.",
    icon: (
      <div className="w-9 h-9 relative flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/be-a-part/enterprise.svg"
          alt="Enterprise icon"
          className="w-full h-full"
        />
      </div>
    ),
  },
];

export default function WhoIsEnabler() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="relative w-full rounded-[20px] bg-blue-600 shadow-md overflow-hidden">
        {/* ── DESKTOP layout ── */}
        <div className="hidden md:block" style={{ minHeight: "480px" }}>
          {/* Sparkle top-left */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="42"
            viewBox="0 0 69 68"
            fill="none"
            aria-hidden="true"
            className="absolute left-10 top-8 z-20"
          >
            <path
              d="M34.3697 67.6033L33.7885 51.9719C33.4329 42.4087 25.7346 34.7392 16.1401 34.3896L2.95503e-06 33.8016L16.1401 33.2136C25.7346 32.8641 33.4329 25.1946 33.7885 15.6314L34.3697 4.6247e-06L34.9509 15.6314C35.3065 25.1946 43.0049 32.8641 52.5994 33.2136L68.7395 33.8016L52.5994 34.3896C43.0049 34.7392 35.3065 42.4087 34.9509 51.9719L34.3697 67.6033Z"
              fill="white"
            />
          </svg>

          {/* Left content */}
          <div className="relative z-10 flex flex-col justify-start items-start gap-5 px-10 pt-24 pb-10 max-w-[620px]">
            <h2 className="text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[1.3]">
              <span className="text-gray-900">Who is an </span>
              <span className="text-white">Enabler</span>
              <span className="text-gray-900">?</span>
            </h2>
            <p className="text-white text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-8">
              Enablers help students learn the right way — through action, proof-of-work and
              community engagement.
            </p>
            <div className="flex flex-col gap-2.5 w-full">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 w-full max-w-[511px] min-h-[80px] bg-blue-700 rounded-2xl px-6 py-4"
                >
                  <div className="shrink-0">{feature.icon}</div>
                  <p className="text-white text-xl font-semibold font-['Plus_Jakarta_Sans'] leading-7">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right sparkles */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="43"
            viewBox="0 0 25 25"
            fill="none"
            aria-hidden="true"
            className="absolute right-[430px] top-[380px] z-20"
          >
            <path
              d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
              fill="white"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 25 25"
            fill="none"
            aria-hidden="true"
            className="absolute right-[320px] top-[270px] z-20"
          >
            <path
              d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
              fill="white"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 25 25"
            fill="none"
            aria-hidden="true"
            className="absolute right-[130px] top-[320px] z-20"
          >
            <path
              d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
              fill="white"
            />
          </svg>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute rounded-r-[20px]"
            style={{ width: "515px", height: "100%", right: 0, top: 0, objectFit: "cover" }}
            src="/assets/be-a-part/enabler-character.svg"
            alt="Campus Enabler Illustration"
          />
        </div>

        {/* ── MOBILE layout ── */}
        <div className="md:hidden flex flex-col">
          {/* Top: text + feature cards */}
          <div className="flex flex-col gap-5 px-8 pt-10 pb-6">
            <h2 className="text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
              <span className="text-gray-900">Who is an </span>
              <span className="text-white">Enabler</span>
              <span className="text-gray-900">?</span>
            </h2>

            <p className="text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-8">
              Enablers help students learn the right way — through action, proof-of-work and
              community engagement.
            </p>

            {/* Feature cards — icon on top, text below */}
            <div className="flex flex-col gap-2.5 w-full">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="w-full p-5 bg-blue-700 rounded-2xl flex flex-col justify-start items-start gap-2.5"
                >
                  <div className="shrink-0">{feature.icon}</div>
                  <p className="text-white text-sm font-semibold font-['Plus_Jakarta_Sans']">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: character image — full, centered */}
          <div className="w-full flex justify-center items-end px-4 pb-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/be-a-part/enabler-character.svg"
              alt="Campus Enabler Illustration"
              className="w-full max-w-xs object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
