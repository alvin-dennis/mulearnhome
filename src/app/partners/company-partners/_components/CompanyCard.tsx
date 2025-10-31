import { MotionA } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { cdnUrl } from "@/services/cdn";

interface CompanyPartner {
  name: string;
  logo: string;
  website: string;
  description?: string;
}

interface CompanyCardProps {
  company: CompanyPartner;
  index: number;
}

export default function CompanyCard({ company, index }: CompanyCardProps) {
  return (
    <MotionA
      href={company.website}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.05, delay: index * 0.05 }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(46, 133, 254, 0.2)",
      }}
      className="group flex items-center justify-between hover:border-color-mulearn-trusty-blue rounded-lg p-3 sm:p-4 transition-all duration-300 bg-white"
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50">
          <MuImage
            src={cdnUrl(company.logo)}
            alt={`${company.name} logo`}
            fill
            className="object-contain p-2"
            sizes="(max-width: 640px) 48px, 64px"
          />
        </div>
        <p className="font-medium text-sm sm:text-base text-color-mulearn-blackish group-hover:text-color-mulearn-trusty-blue transition-colors truncate">
          {company.name}
        </p>
      </div>
    </MotionA>
  );
}
