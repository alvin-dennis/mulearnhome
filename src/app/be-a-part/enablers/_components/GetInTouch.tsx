const SparkleIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
      fill="white"
    />
  </svg>
);

export default function GetInTouch() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      {/* Banner card */}
      <div className="relative w-full rounded-[20px] shadow-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 min-h-[24rem] flex items-center justify-center">
        {/* Blurred orbs — desktop only */}
        <div
          className="hidden md:block absolute w-44 h-52 bg-indigo-300 rounded-full blur-[120px] opacity-70 pointer-events-none"
          style={{ left: "2.5rem", top: "-3.5rem", transform: "rotate(13deg)" }}
        />
        <div
          className="hidden md:block absolute w-48 h-60 bg-blue-500 rounded-full blur-[120px] opacity-60 pointer-events-none"
          style={{ right: "2.5rem", top: "-5rem", transform: "rotate(18deg)" }}
        />

        {/* ── Desktop sparkles ── */}
        <div className="hidden md:block absolute" style={{ left: "18%", top: "35%" }}>
          <SparkleIcon size={44} />
        </div>
        <div className="hidden md:block absolute" style={{ left: "62%", top: "18%" }}>
          <SparkleIcon size={18} />
        </div>
        <div className="hidden md:block absolute" style={{ left: "53%", bottom: "18%" }}>
          <SparkleIcon size={40} />
        </div>
        <div className="hidden md:block absolute" style={{ right: "12%", top: "42%" }}>
          <SparkleIcon size={22} />
        </div>

        {/* ── Mobile corner sparkles ── */}
        {/* Top-left small */}
        <div className="md:hidden absolute top-4 left-5">
          <SparkleIcon size={14} />
        </div>
        {/* Top-left large */}
        <div className="md:hidden absolute top-10 left-4">
          <SparkleIcon size={44} />
        </div>
        {/* Top-right small */}
        <div className="md:hidden absolute top-5 right-6">
          <SparkleIcon size={16} />
        </div>
        {/* Bottom-left */}
        <div className="md:hidden absolute bottom-6 left-5">
          <SparkleIcon size={26} />
        </div>
        {/* Bottom-right small */}
        <div className="md:hidden absolute bottom-8 right-5">
          <SparkleIcon size={40} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-16 max-w-4xl w-full text-center">
          {/* Heading + subtitle */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="md:whitespace-nowrap text-4xl lg:text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
              <span className="text-gray-900">Be part of the change with </span>
              <span className="text-white">µLearn</span>
            </h2>
            <p className="text-indigo-50 text-lg font-normal font-['Plus_Jakarta_Sans'] leading-8">
              Join µLearn as an Enabler and empower your campus community.
            </p>
          </div>

          {/* CTA Button */}
          <button className="w-72 py-5 bg-gray-100 hover:bg-white transition-colors duration-200 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-indigo-300 text-gray-900 text-xl font-bold font-['Plus_Jakarta_Sans'] leading-5 cursor-pointer">
            Get in touch
          </button>
        </div>
      </div>
    </section>
  );
}
