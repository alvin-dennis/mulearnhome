import MuImage from "@/components/MuImage";
import Link from "next/link";
import { cardProps } from "@/lib/types";

const Card = ({
  name,
  image,
  link,
  description,
  largeImg,
  date,
}: cardProps) => {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <div
        className={`flex flex-col items-start p-4 gap-4 w-[310px] h-[475px] bg-white shadow-[8px_8px_28px_rgba(0,0,0,0.12)] rounded-[17px] mt-4 mb-4 transition-all duration-300 ease-in-out cursor-pointer
        hover:-translate-y-2 hover:shadow-[10px_10px_30px_rgba(0,0,0,0.15)] ${
          largeImg ? "group" : ""
        }`}
      >
        <div className="flex justify-center items-center w-[278px] h-[214px] bg-[#f3f3f3] rounded-[17px] overflow-hidden">
          <MuImage
            src={image}
            alt="domain images"
            width={188}
            height={200}
            className={`object-contain h-auto object-top transition-all duration-300 ease-in-out ${
              largeImg ? "group-hover:object-bottom" : ""
            }`}
          />
        </div>

        <p className="font-medium text-[28px] leading-10">{name}</p>
        <p className="font-light text-[16px] leading-[22px]">{date}</p>
        <p className="font-light text-[16px] leading-[22px]">{description}</p>

        {link !== "#" ? (
          <div className="flex flex-row items-center gap-2">
            <span className="uppercase font-medium text-[16px] leading-[22px] group-hover:text-[royalblue]">
              Explore More
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 15 15"
              className="group-hover:fill-[royalblue]"
            >
              <path d="M12.1711 3.983L2.12965 14.0245L0.47998 12.3748L10.5203 2.33333H1.67115V0H14.5045V12.8333H12.1711V3.983Z" />
            </svg>
          </div>
        ) : (
          <span className="uppercase font-medium text-[16px] leading-[22px]">
            Coming Soon!
          </span>
        )}
      </div>
    </Link>
  );
};

export default Card;
