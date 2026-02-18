"use client";

import MuImage from "@/components/MuImage";
import { CompanyPartners1, CompanyPartners as CompanyPartnersData } from "@/data/company_new";

const CompanyPartners = () => {
  // Use the same partner data as the company_new section
  const partners = CompanyPartnersData;
  const secondRowPartners = CompanyPartners1;

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
            Our <span className="text-blue-600">Company Partners</span>
          </h2>
        </div>

        {/* Partners Logo Carousel */}
        <div className="relative">
          {/* Top border line */}
          <div className="border-t border-gray-300 mb-8"></div>

          {/* First Row */}
          <div className="overflow-hidden pb-8">
            <div className="flex animate-scroll-left space-x-12 md:space-x-16">
              {/* Duplicate items for seamless loop */}
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

          {/* Two lines between rows */}
          <div className="border-t border-gray-300"></div>
          <div className="border-t border-gray-300 mt-2 mb-8"></div>

          {/* Second Row */}
          <div className="overflow-hidden pb-8 border-b border-gray-300">
            <div className="flex animate-scroll-right space-x-12 md:space-x-16">
              {/* Duplicate items for seamless loop */}
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

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default CompanyPartners;
