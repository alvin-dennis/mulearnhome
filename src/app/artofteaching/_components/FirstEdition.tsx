import { YouTubeEmbed } from "@next/third-parties/google";
import { artOfTeachingUrls } from "@/data/events";

const FirstEdition = () => {
  return (
    <div className="px-8 py-8 bg-white lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-2/5">
            <h2 className="text-4xl lg:text-6xl font-semibold text-mulearn-blackish leading-tight">
              Art of Teaching <span className="text-mulearn">First Edition</span>
            </h2>
            <p className="mt-4 text-base lg:text-lg text-mulearn-gray-600 lg:w-1/1">
              The First Edition of Art of Teaching was a huge success with more than 100 distinct
              entries, all of which used creative teaching methods to simplify a topic for better
              understanding by a student.
            </p>
          </div>
          <div className="w-full lg:w-2/5 mt-8 lg:mt-0">
            <div
              className="relative w-full rounded-lg overflow-hidden"
              style={{ paddingBottom: "56.25%", height: 0 }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <YouTubeEmbed
                  videoid={artOfTeachingUrls.firstEdition}
                  style="width:100%;height:100%;border:none;"
                  playlabel="true"
                  params="disablekb=1&enablejsapi=1&playsinline=1&modestbranding=1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstEdition;
