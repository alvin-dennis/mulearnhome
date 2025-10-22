import { ClosedCareersCardProps } from "@/lib/types";
import MuImage from "@/components/MuImage";
const ClosedCareersCard = ({
  date,
  title,
  location,
  qualifications,
  role,
  duration,
  remuneration,
  logo,
}: ClosedCareersCardProps) => {
  return (
    <div className="w-80 rounded-lg border-2 border-mulearn-greyish bg-mulearn-whitish p-6 shadow-sm opacity-80 hover:opacity-100 transition-all duration-300">
      {logo && (
        <MuImage
          src={logo}
          alt={`${title} logo`}
          className="mx-auto mb-2.5 object-contain"
          width={150}
          height={125}
        />
      )}

      {title && (
        <p className="mb-2.5 text-center text-[1.75rem] font-semibold bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
          {title}
        </p>
      )}

      <ul className="m-0 list-none p-0 text-center">
        {qualifications && (
          <li className="mb-2 text-base text-mulearn-blackish">
            <strong>Qualifications:</strong> {qualifications}
          </li>
        )}
        {date && (
          <li className="mb-2 text-base text-mulearn-blackish">
            <strong>Dated:</strong> {date}
          </li>
        )}
        {remuneration && (
          <li className="mb-2 text-base text-mulearn-blackish">
            <strong>Package:</strong> {remuneration}
          </li>
        )}
        {role && (
          <li className="mb-2 text-base text-mulearn-blackish">
            <strong>Roles:</strong> {role}
          </li>
        )}
        {duration && (
          <li className="mb-2 text-base text-mulearn-blackish">
            <strong>Duration:</strong> {duration}
          </li>
        )}
        {location && (
          <li className="mb-2 text-base text-mulearn-blackish">
            <strong>Location:</strong> {location}
          </li>
        )}
      </ul>

      {/* Closed button */}
      <div className="flex justify-center mt-4">
        <button
          disabled
          className="bg-mulearn-greyish text-white font-bold rounded-full px-5 py-2 cursor-not-allowed opacity-70"
        >
          Closed
        </button>
      </div>
    </div>
  );
};
export default ClosedCareersCard;

