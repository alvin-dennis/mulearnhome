import Image from "next/image";
import { cdnUrl } from "@/services/cdn";

export default function IGAbout() {
  return (
    <section
      id="about"
      className="px-12 py-12 flex flex-col lg:flex-row items-center justify-between lg:gap-8"
    >
      <div className="flex-1">
        <h1 className="text-mulearn-blackish font-semibold leading-[111.5%] mb-12 text-4xl lg:text-[4.25rem]">
          Interest Groups?
        </h1>
        <p className="text-mulearn-blackish text-lg lg:text-xl leading-[127.5%] max-w-200 mt-8">
          Discover your passion, collaborate with like-minded individuals, and
          embark on a transformative learning journey.
        </p>
        <p className="text-mulearn-blackish text-lg lg:text-xl leading-[127.5%] max-w-200 mt-4">
          Join our vibrant community of students and explore a wide range of
          interest areas, from coding to design, entrepreneurship to data
          science
        </p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center mt-12 lg:mt-0">
        <Image
          src="assets/kkem/kkem-hero.svg"
          alt="Interest Group"
          width={400}
          height={400}
          className="mb-6"
        />
        <p className="text-lg lg:text-[1.35rem] font-medium leading-[127.5%] max-w-[60vmax] mb-4">
          Curated by
        </p>
        <div className="flex items-center justify-between gap-8">
          <Image
            src={cdnUrl("src/modules/Public/KKEM/assets/im7.webp")}
            alt="Curator 1"
            width={56}
            height={56}
            className="rounded-full object-cover shadow-md p-2"
          />
          <Image
            src={cdnUrl("src/modules/Public/KKEM/assets/im9.webp")}
            alt="Curator 2"
            width={56}
            height={56}
            className="rounded-full object-cover shadow-md p-2"
          />
          <Image
            src={cdnUrl("src/modules/Public/KKEM/assets/im10.webp")}
            alt="Curator 3"
            width={56}
            height={56}
            className="rounded-full object-cover shadow-md p-2"
          />
          <p>and more...</p>
        </div>
      </div>
    </section>
  );
}
