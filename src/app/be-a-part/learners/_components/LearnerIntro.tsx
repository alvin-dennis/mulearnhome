import MuImage from "@/components/MuImage";

const LearnerIntro = () => {
  return (
    <section
      className="py-16 md:py-20 container mx-auto px-4"
      aria-labelledby="learners-intro-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Blue Card */}
        <div className="bg-blue-600 rounded-[3rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left side - Illustration */}
          <div className="flex-shrink-0 w-full lg:w-1/3 flex justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 flex items-end justify-center">
              {/* White elliptical shadow/platform
              <div className="absolute bottom-0 w-48 h-8 bg-white rounded-full opacity-80 blur-2xl"></div> */}

              <MuImage
                src="/assets/learners/learner-character.png"
                alt="Learner Character with Lightbulb"
                width={384}
                height={384}
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1 text-white">
            <h2
              id="learners-intro-heading"
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight"
            >
              Who is a Learner?
            </h2>

            <p className="text-base md:text-lg lg:text-xl leading-relaxed">
              A Learner is anyone who chooses to grow. Students, professionals, beginners and career
              changers from any background are welcome. Your degree does not define your potential.
              Your curiosity does. μLearn supports learners in building strong portfolios through
              real tasks, collaboration and consistent effort.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearnerIntro;
