"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CareersCard from "@/app/careers/_components/CareersCard";
import CareersStats from "@/app/careers/_components/CareersStats";
import ClosedCareersCard from "@/app/careers/_components/ClosedCareersCard";
import MuImage from "@/components/MuImage";
import { Button } from "@/components/ui/button";
import LogoLoop from "@/components/ui/LogoLoop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StateDisplay } from "@/components/ui/state-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companies } from "@/data/company";
import type { Company, OngoingHiring, PaginationMeta, PreviousHiring } from "@/lib/types";
import {
  fetchOngoingHiringPage,
  fetchPreviousHiringPage,
  type PaginatedCareersResponse,
} from "@/services/careers";
import { cdnUrl } from "@/services/cdn";

type TabValue = "ongoing" | "previous";

export default function Careers() {
  const [activeTab, setActiveTab] = useState<TabValue>("ongoing");
  const [ongoingPage, setOngoingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const [ongoingData, setOngoingData] = useState<OngoingHiring[]>([]);
  const [previousData, setPreviousData] = useState<PreviousHiring[]>([]);
  const [ongoingPagination, setOngoingPagination] = useState<PaginationMeta | null>(null);
  const [previousPagination, setPreviousPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [ongoingError, setOngoingError] = useState<string | null>(null);
  const [previousError, setPreviousError] = useState<string | null>(null);
  const companyData: Company[] = companies;

  const ITEMS_PER_PAGE = 12;

  const loadOngoing = async (page: number) => {
    const result: PaginatedCareersResponse<OngoingHiring> = await fetchOngoingHiringPage(
      page,
      ITEMS_PER_PAGE,
    );
    setOngoingData(result.data);
    setOngoingPagination(result.pagination);
  };

  const loadPrevious = async (page: number) => {
    const result: PaginatedCareersResponse<PreviousHiring> = await fetchPreviousHiringPage(
      page,
      ITEMS_PER_PAGE,
    );
    setPreviousData(result.data);
    setPreviousPagination(result.pagination);
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setOngoingError(null);
      setPreviousError(null);
      const [ongoingResult, previousResult] = await Promise.allSettled([
        loadOngoing(1),
        loadPrevious(1),
      ]);
      if (isMounted) {
        if (ongoingResult.status === "fulfilled") {
          setOngoingPage(1);
        } else {
          setOngoingError("Failed to load career listings.");
        }
        if (previousResult.status === "fulfilled") {
          setPreviousPage(1);
        } else {
          setPreviousError("Failed to load career listings.");
        }
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOngoingPage = (page: number) => {
    setOngoingPage(page);
    setOngoingError(null);
    loadOngoing(page).catch((err) => {
      console.error("Failed to load ongoing hiring:", err);
      setOngoingError("Failed to load career listings.");
    });
    document.getElementById("careers-listing")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePreviousPage = (page: number) => {
    setPreviousPage(page);
    setPreviousError(null);
    loadPrevious(page).catch((err) => {
      console.error("Failed to load previous hiring:", err);
      setPreviousError("Failed to load career listings.");
    });
    document.getElementById("careers-listing")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getPageNumbers = (totalPages: number, currentPage: number) => {
    const pages: any[] = [];
    for (let i = 1; i <= totalPages; i++) {
      const showPage =
        i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1);
      const showEllipsis =
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2);

      if (showEllipsis) {
        if (!pages.length || pages[pages.length - 1].type !== "ellipsis") {
          pages.push({ type: "ellipsis", key: `ellipsis-${i}` });
        }
      } else if (showPage) {
        pages.push({ type: "page", number: i, key: i });
      }
    }
    return pages;
  };

  const currentOngoing = ongoingData;
  const currentPrevious = previousData;

  return (
    <div className="min-h-screen">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-5xl sm:text-5xl lg:text-7xl font-semibold mb-5 sm:mb-12 text-mulearn-blackish">
              µLearn <span className="text-mulearn">Career Labs</span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-mulearn-gray-600 mb-6 sm:mb-8">
              In search of a job opportunity / internship? µLearn Career Labs helps you connect with
              opportunities from the industry.
            </p>

            <CareersStats />
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link href="/contact?intent=hiring#get-in-touch">
                <Button size="lg" className="text-base font-semibold">
                  Post your job openings
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
            <MuImage
              src="/assets/career/career-hero.svg"
              alt="μLearn Career Illustration"
              width={400}
              height={400}
              className="w-49 sm:w-64 md:w-72 lg:w-80 h-auto rounded-2xl object-cover"
              preload
            />
          </div>
        </div>
      </div>

      <div className="mb-4 mt-12 flex flex-nowrap overflow-x-auto">
        <LogoLoop
          logos={companyData.map((company) => ({
            ...company,
            src: company.src?.startsWith("http") ? company.src : cdnUrl(company.src),
          }))}
          speed={30}
          direction="left"
          logoHeight={30}
          gap={40}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Career partners"
        />
      </div>

      <div
        id="careers-listing"
        className="mx-auto mt-12 mb-12 sm:mb-16 max-w-[1300px] px-4 sm:px-6 lg:px-8"
      >
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          <div className="md:hidden flex justify-center mb-6">
            <Select value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select tab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">
                  Open Positions {ongoingPagination ? `(${ongoingPagination.count})` : ""}
                </SelectItem>
                <SelectItem value="previous">
                  Closed Positions {previousPagination ? `(${previousPagination.count})` : ""}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex justify-center">
            <TabsList className="mb-8 inline-flex">
              <TabsTrigger value="ongoing" className="gap-1 whitespace-nowrap w-auto">
                Open Positions
                {ongoingPagination && (
                  <span className="ml-1.5 text-xs opacity-80">({ongoingPagination.count})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="previous" className="gap-1 whitespace-nowrap w-auto">
                Closed Positions
                {previousPagination && (
                  <span className="ml-1.5 text-xs opacity-80">({previousPagination.count})</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ongoing">
            {loading && ongoingData.length === 0 ? (
              <div className="flex justify-center py-20">
                <p className="text-mulearn-gray-600">Loading open positions…</p>
              </div>
            ) : ongoingError && currentOngoing.length === 0 ? (
              <StateDisplay
                variant="no-results"
                title="Couldn't load open positions"
                description="Something went wrong while fetching career listings. Please try again later."
                size="md"
              />
            ) : currentOngoing.length === 0 ? (
              <StateDisplay
                variant="no-results"
                title="No open positions right now."
                description="Check back soon — new opportunities are posted regularly."
                size="md"
              />
            ) : (
              <>
                <div className="flex flex-wrap items-stretch justify-center gap-4">
                  {currentOngoing.map((role) => (
                    <CareersCard
                      key={role.id}
                      id={role.id}
                      role={role.role}
                      organization={role.organization}
                      title={role.title}
                      location={role.location}
                      lastdate={role.lastdate}
                      remuneration={role.remuneration}
                      vacancies={role.vacancies}
                      duration={role.duration}
                      applylink={role.applylink}
                      jdlink={role.jdlink}
                      posted_date={role.posted_date}
                    />
                  ))}
                </div>
                {ongoingPagination && ongoingPagination.totalPages > 1 && (
                  <div className="mt-12 mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleOngoingPage(ongoingPage - 1)}
                        disabled={ongoingPage === 1}
                        className="flex items-center gap-2 px-4 py-2"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Previous</span>
                      </Button>
                      <div className="flex items-center gap-2">
                        {getPageNumbers(ongoingPagination.totalPages, ongoingPage).map((item) => {
                          if (item.type === "ellipsis") {
                            return (
                              <span key={item.key} className="px-2 text-mulearn-gray-600">
                                ...
                              </span>
                            );
                          }
                          const pageNumber = item.number;
                          return (
                            <Button
                              key={pageNumber}
                              variant={ongoingPage === pageNumber ? "default" : "secondary"}
                              onClick={() => handleOngoingPage(pageNumber)}
                              className="w-10 h-10 text-sm font-medium"
                              aria-label={`Go to page ${pageNumber}`}
                              aria-current={ongoingPage === pageNumber ? "page" : undefined}
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleOngoingPage(ongoingPage + 1)}
                        disabled={ongoingPage === ongoingPagination.totalPages}
                        className="flex items-center gap-2 px-4 py-2"
                        aria-label="Next page"
                      >
                        <span className="text-sm font-medium">Next</span>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="mt-4 text-center text-sm text-mulearn-gray-600">
                      Showing{" "}
                      {ongoingData.length === 0 ? 0 : (ongoingPage - 1) * ITEMS_PER_PAGE + 1}-
                      {Math.min(ongoingPage * ITEMS_PER_PAGE, ongoingPagination.count)} of{" "}
                      {ongoingPagination.count} positions
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="previous">
            {loading && previousData.length === 0 ? (
              <div className="flex justify-center py-20">
                <p className="text-mulearn-gray-600">Loading closed positions…</p>
              </div>
            ) : previousError && currentPrevious.length === 0 ? (
              <StateDisplay
                variant="no-results"
                title="Couldn't load closed positions"
                description="Something went wrong while fetching career listings. Please try again later."
                size="md"
              />
            ) : currentPrevious.length === 0 ? (
              <StateDisplay
                variant="no-results"
                title="No closed positions yet."
                description="Past hiring rounds will show up here once they're closed."
                size="md"
              />
            ) : (
              <>
                <div className="flex flex-wrap items-stretch justify-center gap-4">
                  {currentPrevious.map((role) => (
                    <ClosedCareersCard
                      key={role.id}
                      id={role.id}
                      title={role.title}
                      role={role.role}
                      organization={role.organization}
                      location={role.location}
                      lastdate={role.lastdate}
                      remuneration={role.remuneration}
                      vacancies={role.vacancies}
                      duration={role.duration}
                      extracontent={role.extracontent}
                    />
                  ))}
                </div>
                {previousPagination && previousPagination.totalPages > 1 && (
                  <div className="mt-12 mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handlePreviousPage(previousPage - 1)}
                        disabled={previousPage === 1}
                        className="flex items-center gap-2 px-4 py-2"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Previous</span>
                      </Button>
                      <div className="flex items-center gap-2">
                        {getPageNumbers(previousPagination.totalPages, previousPage).map((item) => {
                          if (item.type === "ellipsis") {
                            return (
                              <span key={item.key} className="px-2 text-mulearn-gray-600">
                                ...
                              </span>
                            );
                          }
                          const pageNumber = item.number;
                          return (
                            <Button
                              key={pageNumber}
                              variant={previousPage === pageNumber ? "default" : "outline"}
                              onClick={() => handlePreviousPage(pageNumber)}
                              className="w-10 h-10 text-sm font-medium"
                              aria-label={`Go to page ${pageNumber}`}
                              aria-current={previousPage === pageNumber ? "page" : undefined}
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handlePreviousPage(previousPage + 1)}
                        disabled={previousPage === previousPagination.totalPages}
                        className="flex items-center gap-2 px-4 py-2"
                        aria-label="Next page"
                      >
                        <span className="text-sm font-medium">Next</span>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="mt-4 text-center text-sm text-mulearn-gray-600">
                      Showing{" "}
                      {previousData.length === 0 ? 0 : (previousPage - 1) * ITEMS_PER_PAGE + 1}-
                      {Math.min(previousPage * ITEMS_PER_PAGE, previousPagination.count)} of{" "}
                      {previousPagination.count} positions
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
