"use client";

import DonateCounters from "@/app/donate/_components/DonateCounters";
import DonationForm from "@/app/donate/_components/DonationForm";
import MuImage from "@/components/MuImage";
import { cdnUrl } from "@/services/cdn";

const heroImg = cdnUrl("src/modules/Public/Donation/assets/heroImg.jpg");

export default function DonatePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-8 min-h-screen">
      <div className="flex flex-col lg:justify-center lg:-mt-15 items-center lg:col-span-1">
        <div className="p-4 text-center lg:text-left lg:max-w-md">
          <h1>
            Help us sustain
            <br />
            Our <span className="text-mulearn">Mission</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Foster an innovation culture, introduce new technologies, and develop skilled
            entrepreneurs.
          </p>

          <div className="mt-6 w-full flex justify-center lg:justify-start">
            <MuImage
              src={heroImg}
              alt="Donate"
              width={500}
              height={500}
              className="rounded-md w-full h-auto max-w-xs sm:max-w-sm md:max-w-md"
              preload
            />
          </div>

          <div className="mt-6">
            <DonateCounters />
          </div>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-2">
        <DonationForm />
      </div>
    </div>
  );
}
