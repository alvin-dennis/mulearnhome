import { cdnUrl } from "@/services/cdn";
import Link from "next/link";
import MuImage from "@/components/MuImage";
import { CommunityCardProps } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

const CommunityCard: React.FC<CommunityCardProps> = ({
  name,
  image,
  link,
  customlink,
}) => {
  const content = (
    <div className="flex items-center gap-4">
      <div className="w-16 rounded-md overflow-hidden flex-shrink-0">
        <MuImage
          src={cdnUrl(image)}
          alt={name}
          className="w-16 h-16 object-contain"
          width={64}
          height={64}
          unoptimized
        />
      </div>

      <div className="flex-1">
        <div className="text-mulearn-gray-600 font-semibold text-sm truncate">
          {name}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="my-4 max-w-xs shadow-[1px_1px_45px_-5px_rgba(0,0,0,0.08)] p-4 rounded-xl h-24 flex items-center justify-evenly bg-mulearn-whitish">
      <CardContent className="p-0">
        {link && link.length > 0 ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="block">
            {content}
          </a>
        ) : customlink && customlink.length > 0 ? (
          <Link href={customlink} className="block">
            {content}
          </Link>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityCard;