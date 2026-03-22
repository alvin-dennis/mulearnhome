const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    viewBox="0 0 25 25"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12.5001 24.587L12.2887 18.9019C12.1594 15.4238 9.35954 12.6345 5.87007 12.5073L-8.32618e-07 12.2935L5.87007 12.0796C9.35953 11.9525 12.1594 9.16315 12.2887 5.68505L12.5001 4.62925e-06L12.7115 5.68505C12.8408 9.16315 15.6407 11.9525 19.1301 12.0796L25.0002 12.2935L19.1301 12.5073C15.6407 12.6345 12.8408 15.4238 12.7115 18.9019L12.5001 24.587Z"
      fill="black"
    />
  </svg>
);

// SVG icons for each card
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AddPersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M18 20V10M12 20V4M6 20v-6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Arrow up for green badge
const ArrowUp = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6"
      stroke="#16A34A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Minus for neutral badge
const MinusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.75 6h6.5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const stats = [
  {
    label: "Active members",
    value: "12,095",
    badge: "+3 interns",
    badgeType: "green",
    icon: <UsersIcon />,
    iconBg: "bg-blue-500",
  },
  {
    label: "Total Members",
    value: "44,700+",
    badge: "+15% from last month",
    badgeType: "green",
    icon: <PersonIcon />,
    iconBg: "bg-blue-600",
  },
  {
    label: "New Members joined",
    value: "88",
    badge: "2 left",
    badgeType: "neutral",
    icon: <AddPersonIcon />,
    iconBg: "bg-blue-600",
  },
  {
    label: "Learners Completion",
    value: "92%",
    badge: "+8% this month",
    badgeType: "green",
    icon: <ChartIcon />,
    iconBg: "bg-blue-600",
  },
];

export default function MissionAndGrowth() {
  return (
    <section className="w-full bg-indigo-50 relative overflow-hidden py-12 px-6">
      {/* Corner sparkles */}
      <div className="hidden md:block absolute top-6 right-10 z-10">
        <SparkleIcon />
      </div>
      <div className="hidden md:block absolute bottom-6 left-8 z-10">
        <SparkleIcon />
      </div>

      <div className="mx-auto max-w-7xl flex flex-col items-center gap-10">
        {/* Heading */}
        <h2 className="text-center text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
          <span className="text-gray-900">Our </span>
          <span className="text-blue-500">Mission </span>
          <span className="text-gray-900">&amp; </span>
          <span className="text-blue-500">Growth</span>
        </h2>

        {/* Stat Cards — single column on mobile, row on lg */}
        <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center items-center gap-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="w-72 h-36 p-6 bg-white rounded-xl shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-100 flex flex-col justify-start items-start"
            >
              <div className="self-stretch flex justify-between items-center">
                {/* Left: label, value, badge */}
                <div className="flex-1 flex flex-col justify-start items-start gap-1">
                  <p className="text-gray-600 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                    {stat.label}
                  </p>
                  <p className="text-gray-900 text-3xl font-bold font-['Plus_Jakarta_Sans'] leading-9 pb-1">
                    {stat.value}
                  </p>

                  {/* Badge */}
                  {stat.badgeType === "green" ? (
                    <div className="px-2.5 py-0.5 bg-green-50 rounded-full inline-flex items-center gap-1">
                      <ArrowUp />
                      <span className="text-green-600 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">
                        {stat.badge}
                      </span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-0.5 bg-gray-50 rounded-full inline-flex items-center gap-1">
                      <MinusIcon />
                      <span className="text-gray-600 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">
                        {stat.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: icon box */}
                <div
                  className={`w-12 h-12 ${stat.iconBg} rounded-xl flex justify-center items-center flex-shrink-0`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
