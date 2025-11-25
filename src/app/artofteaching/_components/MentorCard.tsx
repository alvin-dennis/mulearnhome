import Link from "next/link";
import MuImage from "@/components/MuImage";
import { cdnUrl } from "@/services/cdn";
import { FaLinkedin } from "react-icons/fa";

interface MentorCardProps {
  name: string;
  designation: string;
  image?: string;
  linkedIn?: string;
}


const MentorCard = ({
  name,
  designation,
  image,
  linkedIn,
}: MentorCardProps) => {
  const fallbackImage = cdnUrl("public/assets/team/default.webp");
  // const mentorImage = image ? image : fallbackImage;
  const mentorImage = image ?  fallbackImage: undefined;

  return (
    <div className="mx-auto mt-4 max-w-sm w-full shadow-lg rounded-lg bg-white border border-gray-100 overflow-hidden">
      <div className="p-6 flex flex-col items-center text-center">
        {mentorImage && (
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-50">
            <MuImage
              src={mentorImage}
              alt={`${name} profile`}
              width={128}
              height={128}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        )}

        <div className="w-full mt-4">
          <h3 className="text-lg font-semibold text-mulearn-blackish">{name}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mt-1">{designation}</p>
        </div>

        {linkedIn && linkedIn !== "" && (
          <Link
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center"
          >
            <FaLinkedin className="w-6 h-6 text-mulearn-trusty-blue hover:scale-110 transition-transform duration-300" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default MentorCard;
