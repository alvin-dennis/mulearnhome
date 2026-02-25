import MuImage from "@/components/MuImage";
import { CompanyPartners1, CompanyPartners as CompanyPartnersData } from "@/data/company_new";

const Partners = () => {
  const partners = CompanyPartnersData;
  const secondRowPartners = CompanyPartners1;

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Our <span className="text-mulearn">Company Partners</span>
          </h2>
        </div>

        <div className="relative">
          <div className="border-t border-gray-300 mb-8"></div>
          <div className="overflow-hidden pb-8">
            <div className="flex animate-scroll-left space-x-12 md:space-x-16">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`${partner.title}-${index}`}
                  className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center transition-all duration-300"
                >
                  <MuImage
                    src={partner.image}
                    alt={partner.title}
                    width={160}
                    height={96}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-300"></div>
          <div className="border-t border-gray-300 mt-2 mb-8"></div>
          <div className="overflow-hidden pb-8 border-b border-gray-300">
            <div className="flex animate-scroll-right space-x-12 md:space-x-16">
              {[...secondRowPartners, ...secondRowPartners].map((partner, index) => (
                <div
                  key={`${partner.title}-${index}`}
                  className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center transition-all duration-300"
                >
                  <MuImage
                    src={partner.image}
                    alt={partner.title}
                    width={160}
                    height={96}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
