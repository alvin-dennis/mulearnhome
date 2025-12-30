"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Building2, Check, Copy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BANK_TRANSFER_THRESHOLD,
  type DonationFormData,
  type DonationType,
  donationFormSchema,
} from "@/lib/schemas/donation";
import { cn } from "@/lib/utils";
import {
  generateReferenceCode,
  submitBankTransfer,
  submitDonationForm,
  submitSubscription,
} from "@/services/donation";
import { annualTiers, monthlyTiers, oneTimeTiers, type PatronTierConfig } from "./PatronData";

// Bank details for display
const BANK_DETAILS = {
  accountName: "MULEARN FOUNDATION",
  bankName: "ICICI Bank",
  accountNumber: "263405011014",
  ifscCode: "ICIC0002534",
  branch: "Technopark, Trivandrum",
  accountType: "Current",
} as const;

export default function DonationForm() {
  const [mounted, setMounted] = useState(false);
  const [donationType, setDonationType] = useState<DonationType>("one-time");
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [proofUrl, setProofUrl] = useState<string>("");
  const [proofUrlError, setProofUrlError] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      donationName: "",
      email: "",
      phone: "",
      panNumber: "",
      address: "",
      isOrganisation: false,
      organisationName: "",
      termsAccepted: false,
      donationAmount: 0,
      donationType: "one-time",
    },
  });

  const isOrganisation = watch("isOrganisation");
  const totalAmount = watch("donationAmount") || 0;

  // Bank transfer mode when amount >= 5L
  const isBankTransferMode = totalAmount >= BANK_TRANSFER_THRESHOLD;

  // Generate reference code once when entering bank transfer mode
  const referenceCode = useMemo(() => {
    if (isBankTransferMode) {
      return generateReferenceCode();
    }
    return "";
  }, [isBankTransferMode]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTiers = (type: DonationType): PatronTierConfig[] => {
    switch (type) {
      case "one-time":
        return oneTimeTiers;
      case "yearly":
        return annualTiers;
      case "monthly":
        return monthlyTiers;
      default:
        return oneTimeTiers;
    }
  };

  const currentTiers = getTiers(donationType);

  useEffect(() => {
    setSelectedAmount("");
    setCustomAmount("");
    setValue("donationAmount", 0, { shouldValidate: true });
    // Reset selected amount when organization status changes for recurring types
    if (donationType !== "one-time") {
      setSelectedAmount("");
    }
  }, [donationType, setValue]);

  const handleTierSelect = (tier: PatronTierConfig) => {
    setSelectedAmount(tier.id);
    let amount = tier.amount;

    // For annual/monthly, amount depends on isOrganisation
    if (donationType !== "one-time") {
      amount = isOrganisation ? tier.amountOrg || tier.amount : tier.amountInd || tier.amount;
    }

    setValue("donationAmount", amount, { shouldValidate: true });
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value) || 0;
    setValue("donationAmount", numValue, { shouldValidate: true });
  };

  const getDisplayAmount = (tier: PatronTierConfig) => {
    if (donationType === "one-time") return tier.amount;
    return isOrganisation ? tier.amountOrg || tier.amount : tier.amountInd || tier.amount;
  };

  const onSubmit = async (data: DonationFormData) => {
    try {
      // Bank transfer mode - bypass Razorpay
      if (isBankTransferMode) {
        // Validate proof URL
        if (!proofUrl.trim()) {
          setProofUrlError("Please provide the payment proof URL");
          toast.error("Please provide the payment proof URL");
          return;
        }
        try {
          new URL(proofUrl);
          setProofUrlError("");
        } catch {
          setProofUrlError("Please enter a valid URL");
          toast.error("Please enter a valid URL for payment proof");
          return;
        }

        toast.loading("Submitting bank transfer details...", { id: "donation-loading" });

        await submitBankTransfer({
          amount: data.donationAmount,
          name: data.name,
          donationName: data.donationName,
          email: data.email,
          mobile: data.phone,
          pan: data.panNumber,
          address: data.address,
          donationType: data.donationType,
          isOrganisation: data.isOrganisation,
          organisationName: data.organisationName,
          proofUrl: proofUrl,
          referenceCode: referenceCode,
        });

        toast.dismiss("donation-loading");
        return;
      }

      // Normal Razorpay flow
      const loadingMessage =
        data.donationType === "one-time"
          ? "Processing your patron contribution..."
          : "Setting up your recurring support...";
      toast.loading(loadingMessage, { id: "donation-loading" });

      const payload = {
        amount: data.donationAmount,
        name: data.name,
        email: data.email,
        mobile: data.phone,
        pan: data.panNumber,
        address: data.address,
        donationType: data.donationType,
        isOrganisation: data.isOrganisation,
        organisationName: data.organisationName,
        donation_name: data.donationName,
      };

      if (data.donationType === "one-time") {
        await submitDonationForm(payload);
      } else {
        await submitSubscription(payload);
      }

      toast.dismiss("donation-loading");
    } catch (error) {
      toast.dismiss("donation-loading");
      console.error("Donation submission error:", error);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!mounted) {
    return (
      <div className="w-full bg-mulearn-whitish rounded-lg border border-mulearn-gray-600/20 shadow-sm flex flex-col max-h-[calc(100vh-10rem)] overflow-hidden">
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-mulearn-gray-600">Loading form...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-mulearn-whitish rounded-xl border border-mulearn-gray-600/20 shadow-xl flex flex-col max-h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 min-h-0 bg-white">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-mulearn-blackish">
              Become a Patron
            </h2>
            <p className="text-mulearn-gray-600 text-sm mt-1">
              Join the movement to fuel open learning and innovation
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-mulearn-greyish/10 p-1.5 rounded-lg border border-mulearn-gray-600/10 self-start">
            <Checkbox
              id="isOrganisation"
              checked={isOrganisation}
              onChange={(e) => setValue("isOrganisation", e.target.checked)}
              className="data-[state=checked]:bg-mulearn-trusty-blue data-[state=checked]:border-mulearn-trusty-blue"
            />
            <Label
              htmlFor="isOrganisation"
              className="text-sm font-medium cursor-pointer text-mulearn-gray-600 pr-2 select-none"
            >
              I&apos;m paying as an Organization
            </Label>
          </div>
        </div>

        <Tabs
          value={donationType}
          onValueChange={(v) => setDonationType(v as DonationType)}
          className="space-y-6"
        >
          <TabsList className="w-full h-auto p-1 bg-mulearn-greyish/10 rounded-xl border border-mulearn-gray-600/10 grid grid-cols-1 sm:grid-cols-3 gap-1">
            <TabsTrigger
              value="one-time"
              className="py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-mulearn-trusty-blue data-[state=active]:shadow-sm text-mulearn-gray-600"
            >
              Founding Patron (One-Time)
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-mulearn-trusty-blue data-[state=active]:shadow-sm text-mulearn-gray-600"
            >
              Annual Supporter
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="py-2.5 rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-mulearn-trusty-blue data-[state=active]:shadow-sm text-mulearn-gray-600"
            >
              Monthly Supporter
            </TabsTrigger>
          </TabsList>

          <TabsContent value={donationType} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {currentTiers.map((tier) => {
                const isSelected = selectedAmount === tier.id;
                const displayAmount = getDisplayAmount(tier);

                return (
                  <div
                    key={tier.id}
                    onClick={() => handleTierSelect(tier)}
                    className={cn(
                      "relative rounded-xl border p-5 cursor-pointer transition-all duration-200 group overflow-hidden",
                      isSelected
                        ? `bg-gradient-to-r ${tier.color} border-mulearn-trusty-blue/30 ring-2 ring-offset-2 ring-mulearn-trusty-blue/30 shadow-lg`
                        : "bg-white border-mulearn-gray-600/20 hover:border-mulearn-trusty-blue/50 hover:bg-mulearn-whitish",
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={cn(
                              "text-lg font-bold",
                              isSelected ? tier.textColor : "text-mulearn-blackish",
                            )}
                          >
                            {tier.label}
                          </h3>
                          {tier.limit && (
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-mulearn-blackish text-white">
                              {tier.limit}
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isSelected ? `${tier.textColor}/80` : "text-mulearn-gray-600",
                          )}
                        >
                          {tier.description}
                        </p>

                        {/* Benefits List - Expanded when selected */}
                        {(isSelected || window.innerWidth >= 640) && (
                          <ul className="mt-3 space-y-1.5">
                            {tier.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm leading-snug">
                                <span
                                  className={cn(
                                    "mt-0.5 size-1.5 rounded-full shrink-0",
                                    isSelected ? "bg-current opacity-60" : "bg-mulearn-trusty-blue",
                                  )}
                                ></span>
                                <span
                                  className={cn(
                                    benefit.highlight ? "font-semibold" : "",
                                    isSelected ? "text-mulearn-blackish" : "text-mulearn-gray-600",
                                  )}
                                >
                                  {benefit.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={cn(
                            "text-2xl font-bold tabular-nums tracking-tight",
                            isSelected ? tier.textColor : "text-mulearn-blackish",
                          )}
                        >
                          ₹{displayAmount.toLocaleString("en-IN")}
                        </div>
                        <div
                          className={cn(
                            "text-xs font-medium uppercase tracking-wider opacity-60",
                            isSelected ? tier.textColor : "text-mulearn-gray-600",
                          )}
                        >
                          {donationType === "one-time"
                            ? "Single Contribution"
                            : `Per ${donationType === "monthly" ? "Month" : "Year"}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Custom Amount Option */}
              <div
                className={cn(
                  "relative rounded-xl border p-5 transition-all duration-200",
                  selectedAmount === "custom"
                    ? "bg-mulearn-whitish border-mulearn-trusty-blue ring-1 ring-mulearn-trusty-blue"
                    : "bg-white border-mulearn-gray-600/20 hover:border-mulearn-trusty-blue/30",
                )}
              >
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className="flex items-center gap-3 flex-1 w-full"
                    onClick={() => setSelectedAmount("custom")}
                  >
                    <input
                      type="radio"
                      name="amount-selection"
                      id="custom-amt"
                      checked={selectedAmount === "custom"}
                      onChange={() => setSelectedAmount("custom")}
                      className="sr-only"
                    />
                    <Label
                      htmlFor="custom-amt"
                      className="font-semibold text-mulearn-blackish cursor-pointer whitespace-nowrap"
                    >
                      Custom Amount
                    </Label>
                    <div className="h-px bg-mulearn-gray-600/20 flex-1"></div>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mulearn-gray-600">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        handleCustomAmountChange(e.target.value);
                        setSelectedAmount("custom");
                      }}
                      onClick={() => setSelectedAmount("custom")}
                      className="pl-7 bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue focus:ring-1 focus:ring-mulearn-trusty-blue transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="pt-8 border-t border-mulearn-gray-600/10 space-y-6">
              <h3 className="text-lg font-bold text-mulearn-blackish tracking-tight">
                Your Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-mulearn-gray-600">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                    className={`bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donationName" className="text-mulearn-gray-600">
                    Donation Name{" "}
                    <span className="text-mulearn-gray-600/60 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="donationName"
                    {...register("donationName")}
                    placeholder="e.g. In honor of someone special"
                    className="bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-mulearn-gray-600">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className={`bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-mulearn-gray-600">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+91 98765 43210"
                    className={`bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-mulearn-gray-600">
                    PAN Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pan"
                    {...register("panNumber", {
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase();
                      },
                    })}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className={`bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue ${errors.panNumber ? "border-red-500" : ""}`}
                  />
                  {errors.panNumber && (
                    <p className="text-xs text-red-500">{errors.panNumber.message}</p>
                  )}
                </div>

                {isOrganisation && (
                  <div className="space-y-2">
                    <Label htmlFor="orgName" className="text-mulearn-gray-600">
                      Organisation Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="orgName"
                      {...register("organisationName")}
                      placeholder="Acme Corp"
                      className={`bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue ${errors.organisationName ? "border-red-500" : ""}`}
                    />
                    {errors.organisationName && (
                      <p className="text-xs text-red-500">{errors.organisationName.message}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-mulearn-gray-600">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  {...register("address")}
                  placeholder="Full address"
                  rows={3}
                  className={`resize-none bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue ${errors.address ? "border-red-500" : ""}`}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>

              {/* Bank Transfer Section - Only shown when amount >= 5L */}
              {isBankTransferMode && (
                <div className="pt-6">
                  {/* Disclaimer */}
                  <div className="flex items-start gap-3 p-4 mb-6 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Donations above <span className="font-semibold">₹5,00,000</span> are processed
                      via bank transfer and verified manually for compliance and security.
                    </p>
                  </div>

                  {/* Bank Details Card */}
                  <div className="border border-mulearn-gray-600/20 rounded-xl overflow-hidden">
                    <div className="bg-mulearn-greyish/10 px-5 py-4 border-b border-mulearn-gray-600/10">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-mulearn-trusty-blue" />
                        <h4 className="font-bold text-mulearn-blackish">Bank Transfer Details</h4>
                      </div>
                      <p className="text-xs text-mulearn-gray-600 mt-1">
                        Please complete the transfer using NEFT/RTGS and provide the proof link
                        below.
                      </p>
                    </div>

                    <div className="p-5 space-y-3">
                      {/* Bank Details Grid */}
                      {[
                        {
                          label: "Account Name",
                          value: BANK_DETAILS.accountName,
                          key: "accountName",
                        },
                        { label: "Bank Name", value: BANK_DETAILS.bankName, key: "bankName" },
                        {
                          label: "Account Number",
                          value: BANK_DETAILS.accountNumber,
                          key: "accountNumber",
                        },
                        { label: "IFSC Code", value: BANK_DETAILS.ifscCode, key: "ifsc" },
                        { label: "Branch", value: BANK_DETAILS.branch, key: "branch" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-sm text-mulearn-gray-600">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-mulearn-blackish font-mono">
                              {item.value}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(item.value, item.key)}
                              className="p-1 hover:bg-mulearn-greyish/20 rounded transition-colors"
                            >
                              {copiedField === item.key ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-mulearn-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Reference Code */}
                      <div className="mt-4 p-3 bg-mulearn-trusty-blue/5 rounded-lg border border-mulearn-trusty-blue/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-mulearn-gray-600 uppercase tracking-wide font-semibold">
                              Reference Code
                            </p>
                            <p className="text-lg font-bold font-mono text-mulearn-trusty-blue">
                              {referenceCode}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(referenceCode, "referenceCode")}
                            className="p-2 bg-white hover:bg-mulearn-greyish/10 rounded-lg border border-mulearn-gray-600/20 transition-colors"
                          >
                            {copiedField === "referenceCode" ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-mulearn-gray-600" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-mulearn-gray-600 mt-2">
                          Include this reference code in your bank transfer remark/description.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proof URL Input */}
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="proofUrl" className="text-mulearn-gray-600">
                      Payment Proof URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="proofUrl"
                      type="url"
                      value={proofUrl}
                      onChange={(e) => {
                        setProofUrl(e.target.value);
                        if (proofUrlError) setProofUrlError("");
                      }}
                      placeholder="https://example.com/payment-screenshot.png"
                      className={`bg-white border-mulearn-gray-600/20 focus:border-mulearn-trusty-blue ${proofUrlError ? "border-red-500" : ""}`}
                    />
                    {proofUrlError && <p className="text-xs text-red-500">{proofUrlError}</p>}
                    <p className="text-xs text-mulearn-gray-600">
                      Provide a link to your payment receipt or screenshot (e.g., Google Drive,
                      Dropbox, or any image hosting service).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Footer for Action */}
      <div className="border-t border-mulearn-gray-600/10 bg-white px-6 sm:px-8 py-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox id="termsAccepted" {...register("termsAccepted")} className="mt-0.5" />
            <div className="flex-1">
              <Label
                htmlFor="termsAccepted"
                className="text-xs text-mulearn-gray-600 font-normal leading-relaxed"
              >
                I agree to the{" "}
                <a
                  href="/termsandconditions"
                  target="_blank"
                  className="text-mulearn-trusty-blue hover:underline"
                  rel="noopener"
                >
                  Terms
                </a>
                ,{" "}
                <a
                  href="/privacypolicy"
                  target="_blank"
                  className="text-mulearn-trusty-blue hover:underline"
                  rel="noopener"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="/refundpolicy"
                  target="_blank"
                  className="text-mulearn-trusty-blue hover:underline"
                  rel="noopener"
                >
                  Refund Policy
                </a>
                .
              </Label>
              {errors.termsAccepted && (
                <p className="text-xs text-red-500 mt-1">{errors.termsAccepted.message}</p>
              )}
            </div>
          </div>

          {errors.donationAmount && (
            <p className="text-xs text-red-500">{errors.donationAmount.message}</p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-mulearn-gray-600 uppercase tracking-widest font-semibold">
                Total Contribution
              </p>
              <p className="text-3xl font-bold text-mulearn-blackish tracking-tight">
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              className={cn(
                "w-full sm:w-auto px-8 py-6 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all",
                isBankTransferMode
                  ? "bg-amber-500 shadow-amber-500/20 hover:shadow-amber-500/30"
                  : "bg-mulearn-trusty-blue shadow-mulearn-trusty-blue/20 hover:shadow-mulearn-trusty-blue/30",
              )}
              disabled={!isValid || totalAmount === 0 || (isBankTransferMode && !proofUrl.trim())}
            >
              {isBankTransferMode ? "Submit for Verification" : "Proceed to Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
