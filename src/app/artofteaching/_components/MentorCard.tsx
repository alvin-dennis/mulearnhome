import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import MuImage from "@/components/MuImage";
import { cdnUrl } from "@/services/cdn";

interface MentorCardProps {
  name: string;
  designation: string;
  image?: string;
  linkedIn?: string;
}

const MentorCard = ({ name, designation, image, linkedIn }: MentorCardProps) => {
  const fallbackImage = cdnUrl("public/assets/team/default.webp");
  const mentorImage = image ? fallbackImage : undefined;

  return (
    <div className="mx-auto mt-4 max-w-sm w-full shadow-lg rounded-lg p-6 bg-white border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        {mentorImage && (
          <MuImage
            src={mentorImage}
            alt={`${name} profile`}
            width={80}
            height={80}
            className="object-cover w-20 h-20 rounded-md"
            loading="lazy"
          />
        )}
        <div className="flex flex-col items-end">
          {linkedIn && linkedIn !== "" && (
            <Link href={linkedIn} target="_blank" rel="noopener noreferrer" className="mt-2 group">
              <FaLinkedin className="w-7 h-7 rounded overflow-hidden hover:scale-110 transition-transform duration-300 hover:shadow-lg" />
            </Link>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-mulearn-blackish mt-4 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{designation}</p>
    </div>
  );
};

export default MentorCard;
