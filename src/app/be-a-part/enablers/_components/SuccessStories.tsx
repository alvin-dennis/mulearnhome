"use client";

import { MotionDiv } from "@/components/MuFramer";
import { Card, CardContent } from "@/components/ui/card";

const stories = [
  {
    name: "Dr. A G Mathew",
    role: "Principal, St. Thomas Institute of Science and Technology",
    url: "https://youtu.be/oyvb4-decaY?si=xbsRahh_mIschz-R",
  },
  {
    name: "Dr. Neelakantan P C",
    role: "Principal, Muthoot Institute of Science and Technology",
    url: "https://youtu.be/oyvb4-decaY?si=2qGCXXH89j9yzmZ-&t=21",
  },
  {
    name: "Sharika T R",
    role: "Lead Enabler µLearn, Adi Shankara Institute of Engineering and Technology",
    url: "https://youtu.be/oyvb4-decaY?si=_qT1fFmQJVmlmJmg&t=63",
  },
  {
    name: "Dr. M Manoj",
    role: "Lead Enabler µLearn, Marian Engineering College",
    url: "https://youtu.be/oyvb4-decaY?si=fEPdIxDP4uanErYi&t=73",
  },
];

const getEmbedUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);

    let videoId = "";
    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.slice(1);
    } else if (parsedUrl.hostname.includes("youtube.com")) {
      videoId = parsedUrl.searchParams.get("v") ?? "";
    }

    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
    const start = parsedUrl.searchParams.get("t");
    const si = parsedUrl.searchParams.get("si");

    if (start) {
      embedUrl.searchParams.set("start", start.replace("s", ""));
    }
    if (si) {
      embedUrl.searchParams.set("si", si);
    }

    return embedUrl.toString();
  } catch {
    return url;
  }
};

export default function SuccessStories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold font-['Plus_Jakarta_Sans'] leading-[62.40px]">
          <span className="text-gray-900">Success Stories from </span>
          <span className="text-blue-500">µLearn Community</span>
        </h2>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative w-full overflow-hidden py-10"
      >
        <MotionDiv
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity, repeatType: "loop" }}
          className="flex gap-4 md:gap-6 mt-10 w-max"
        >
          {[...stories, ...stories].map((story, index) => (
            <Card
              key={`${story.url}-${index}`}
              className="shrink-0 w-[320px] md:w-105 min-w-[320px] bg-white rounded-[28px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden"
            >
              <CardContent className="p-0 flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <iframe
                    src={getEmbedUrl(story.url)}
                    title={`${story.name} success story`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <p className="text-gray-900 text-base md:text-lg font-bold font-['Plus_Jakarta_Sans'] leading-6">
                    {story.name}
                  </p>
                  <p className="text-gray-500 text-xs md:text-sm font-medium leading-5">
                    {story.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </MotionDiv>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20 bg-linear-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20 bg-linear-to-l from-white to-transparent z-10" />
      </MotionDiv>

      <div className="hidden md:flex justify-end mt-4 pr-2">
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
      </div>
    </section>
  );
}
