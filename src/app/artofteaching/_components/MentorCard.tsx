import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import MuImage from "@/components/MuImage";
import { cdnUrl } from "@/services/cdn";
import { Card, CardContent } from "@/components/ui/card"

interface MentorCardProps {
  name: string;
  designation: string;
  image?: string;
  linkedIn?: string;
}

const MentorCard = ({ name, designation, image, linkedIn }: MentorCardProps) => {
  const fallbackImage = cdnUrl("public/assets/team/default.webp");
  // const mentorImage = image ? image : fallbackImage;
  const mentorImage = image ?  fallbackImage: undefined;

  return (
    <Card className="mx-auto mt-4 max-w-sm w-full overflow-hidden">
      <CardContent className="flex flex-col items-center text-center">
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
        <div className="flex flex-col items-end">
          {linkedIn && linkedIn !== "" && (
            <Link href={linkedIn} target="_blank" rel="noopener noreferrer" className="mt-2 group">
              <FaLinkedin className="w-7 h-7 rounded overflow-hidden hover:scale-110 transition-transform duration-300 hover:shadow-lg" />
            </Link>
          )}
        </div>
      </CardContent>

      <h3 className="text-lg font-semibold text-mulearn-blackish mt-4 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{designation}</p>
    </Card>
  );
};

export default MentorCard;
