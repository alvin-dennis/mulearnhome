"use client";

import { Check, Clock, Copy, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MuImage from "@/components/MuImage";
import { Button } from "@/components/ui/button";

interface DonationData {
  donationType: string;
  amount: number;
  name: string;
  email: string;
  paymentId?: string;
  referenceCode?: string;
  isBankTransfer?: boolean;
  status?: string;
  [key: string]: unknown;
}

export default function DonateSuccessPage() {
  const router = useRouter();
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("donationData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setDonationData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse donation data:", error);
        setTimeout(() => router.push("/donate"), 3000);
      }
    } else {
      setTimeout(() => router.push("/donate"), 3000);
    }
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatDonationType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading || !donationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mulearn-whitish">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-mulearn-trusty-blue/20 border-t-mulearn-trusty-blue rounded-full animate-spin"></div>
          <p className="text-mulearn-gray-600 font-medium animate-pulse">Processing...</p>
        </div>
      </div>
    );
  }

  const isBankTransfer = donationData.isBankTransfer === true;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl perspective-1000">
        {/* Main Card - Split Layout */}
        <div className="bg-white rounded-4xl shadow-2xl shadow-mulearn-trusty-blue/10 overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-scale-in">
          {/* Left Side: Brand & Status */}
          <div
            className={`w-full md:w-5/12 relative overflow-hidden flex flex-col items-center justify-center p-10 text-center text-white ${
              isBankTransfer ? "bg-amber-500" : "bg-mulearn-trusty-blue"
            }`}
          >
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div
              className={`absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 ${
                isBankTransfer ? "bg-yellow-300/20" : "bg-cyan-400/20"
              }`}
            ></div>

            <div className="relative z-10 w-full">
              <div className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 ring-4 ring-white/20 shadow-xl">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {isBankTransfer ? (
                    <Clock className="w-8 h-8 text-amber-500 stroke-3" />
                  ) : (
                    <Check className="w-8 h-8 text-mulearn-trusty-blue stroke-3" />
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">
                {isBankTransfer ? "Submitted for Verification" : "Payment Successful"}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-xs mx-auto">
                {isBankTransfer
                  ? "We've received your donation details and payment proof."
                  : "Thank you for empowering the next generation of learners."}
              </p>
            </div>
          </div>

          {/* Right Side: Receipt Details */}
          <div className="w-full md:w-7/12 bg-white p-8 sm:p-12 flex flex-col justify-center relative">
            {/* Watermark Logo */}
            <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
              <MuImage
                src="/assets/logo.png"
                alt=""
                className="h-16 w-auto grayscale"
                width={64}
                height={64}
              />
            </div>

            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest font-bold text-mulearn-gray-600/60 mb-1">
                Total Contribution
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-mulearn-blackish">
                  ₹{donationData.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-medium text-mulearn-gray-600">INR</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-mulearn-gray-600">Donation Type</span>
                <span className="text-sm font-bold text-mulearn-blackish">
                  {formatDonationType(donationData.donationType)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-mulearn-gray-600">Donor Name</span>
                <span className="text-sm font-bold text-mulearn-blackish truncate max-w-[180px]">
                  {donationData.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-mulearn-gray-600">Date</span>
                <span className="text-sm font-bold text-mulearn-blackish">
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {/* Reference Code for Bank Transfer */}
              {isBankTransfer && donationData.referenceCode && (
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between py-3 group cursor-pointer border-b border-gray-100"
                  onClick={() => copyToClipboard(donationData.referenceCode || "")}
                  onKeyDown={(e) =>
                    e.key === "Enter" && copyToClipboard(donationData.referenceCode || "")
                  }
                >
                  <span className="text-sm font-medium text-mulearn-gray-600">Reference Code</span>
                  <div className="flex items-center gap-2 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 group-hover:border-amber-400 transition-colors">
                    <span className="text-xs font-mono text-amber-700 group-hover:text-amber-800">
                      {donationData.referenceCode}
                    </span>
                    <Copy className="w-3 h-3 text-amber-400 group-hover:text-amber-600" />
                  </div>
                </div>
              )}
              {/* Transaction ID for Razorpay */}
              {donationData.paymentId && (
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between py-3 group cursor-pointer"
                  onClick={() => copyToClipboard(donationData.paymentId || "")}
                  onKeyDown={(e) =>
                    e.key === "Enter" && copyToClipboard(donationData.paymentId || "")
                  }
                >
                  <span className="text-sm font-medium text-mulearn-gray-600">Transaction ID</span>
                  <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 group-hover:border-mulearn-trusty-blue/30 transition-colors">
                    <span className="text-xs font-mono text-mulearn-gray-600 group-hover:text-mulearn-trusty-blue">
                      {donationData.paymentId.slice(0, 16)}...
                    </span>
                    <Copy className="w-3 h-3 text-gray-400 group-hover:text-mulearn-trusty-blue" />
                  </div>
                </div>
              )}
            </div>

            {/* Status Message */}
            {isBankTransfer ? (
              <div className="flex items-start gap-3 text-sm text-amber-800 mb-8 bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="bg-white p-1.5 rounded-full shadow-xs shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="leading-relaxed">
                  Please allow <span className="font-semibold">24–48 hours</span> for verification.
                  You will be contacted at{" "}
                  <span className="font-semibold">{donationData.email}</span> once the payment is
                  confirmed.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-mulearn-gray-600 mb-8 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                <div className="bg-white p-1.5 rounded-full shadow-xs">
                  <Mail className="w-4 h-4 text-mulearn-trusty-blue" />
                </div>
                <p>
                  Receipt sent to{" "}
                  <span className="font-semibold text-mulearn-blackish">{donationData.email}</span>
                </p>
              </div>
            )}

            <Button
              variant="custom"
              onClick={() => router.push("/")}
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-mulearn-trusty-blue/20 hover:shadow-xl transition-all"
            >
              Return to Home
            </Button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-sm text-mulearn-gray-600/60">
          Need help?{" "}
          <a
            href="mailto:donate@mulearn.org"
            className="text-mulearn-trusty-blue font-medium hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
