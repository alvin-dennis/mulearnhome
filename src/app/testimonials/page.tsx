"use client";

import { MessageCircle, Star, TrendingUp, Users, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

import { MotionDiv, MotionH1, MotionP } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";
import type { Counts, TextTestimonial, VideoTestimonial } from "@/lib/types";
import { useRedirectToApp } from "@/lib/utils";
import TextTestimonialsGrid, { type TextFilterType } from "./_components/TextTestimonialsGrid";
import VideoCarousel from "./_components/VideoCarousel";

export default function TestimonialsPage() {
  const [videoTestimonialData] = useState<VideoTestimonial[]>(testimonials.video);
  const [textTestimonialData] = useState<TextTestimonial[]>(testimonials.text);
  const [activeTab, setActiveTab] = useState<"video" | "text">("video");
  const [categoryFilter, setCategoryFilter] = useState<TextFilterType>("all");
  const redirect = useRedirectToApp();
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    setRefreshToken(localStorage.getItem("refreshToken"));
  }, []);

  const [counts, setCounts] = useState<Counts | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = new WebSocket("wss://mulearn.org/ws/v1/public/landing-stats/");
      socketRef.current = socket;

      const handleMessage = (event: MessageEvent) => {
        setCounts(JSON.parse(event.data) as Counts);
      };

      const handleError = (event: Event) => {
        void event;
      };

      socket.addEventListener("message", handleMessage);
      socket.addEventListener("error", handleError);

      return () => {
        socket.removeEventListener("message", handleMessage);
        socket.removeEventListener("error", handleError);
        socket.close();
        socketRef.current = null;
      };
    }
  }, []);

  const stats = counts
    ? [
        {
          icon: Users,
          value: counts.members,
          label: "Active Learners",
        },
        {
          icon: Star,
          value:
            counts.enablers_mentors_count?.find((r) => r.role__title === "Mentor")?.role_count || 0,
          label: "Expert Mentors",
        },
        {
          icon: TrendingUp,
          value: counts.org_type_counts?.find((o) => o.org_type === "Company")?.org_count || 0,
          label: "Partner Companies",
        },
      ]
    : [];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-32 pb-12 sm:pb-24">
          <MotionDiv
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MotionH1
              className=" text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center max-w-6xl mx-auto mb-6 leading-normal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Voices of <span className="text-mulearn">Impact</span>
            </MotionH1>
            <MotionP
              className="text-base sm:text-xl md:text-2xl text-mulearn-gray-600  max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover authentic stories and feedback from our community members who are shaping the
              future of learning
            </MotionP>

            {stats.length > 0 && (
              <MotionDiv
                className="flex justify-center items-center gap-6 sm:gap-8 mt-6 sm:mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center group">
                      <div className="flex items-center justify-center w-12 h-12 bg-mulearn rounded-xl mx-auto mb-3 group-hover:bg-mulearn-blackish transition-colors">
                        <Icon className="w-6 h-6 text-mulearn-whitish" />
                      </div>
                      <div className=" text-2xl font-bold text-mulearn-blackish">
                        <CountUp end={stat.value} duration={2.5} separator="," />
                      </div>
                      <div className="text-sm text-mulearn-gray-500  uppercase tracking-wide group-hover:text-mulearn transition-colors">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </MotionDiv>
            )}
          </MotionDiv>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-mulearn-whitish/80 backdrop-blur-sm border-b border-mulearn-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center items-center gap-2 bg-mulearn-gray-100 rounded-2xl p-2 my-6 max-w-full">
              <Button
                onClick={() => setActiveTab("video")}
                variant={activeTab === "video" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto min-w-0 ${
                  activeTab === "video" ? "shadow-sm" : "text-mulearn-gray-600"
                }`}
              >
                <Video className="w-5 h-5" />
                Video Testimonials
              </Button>
              <Button
                onClick={() => setActiveTab("text")}
                variant={activeTab === "text" ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto min-w-0 ${
                  activeTab === "text" ? "shadow-sm" : "text-mulearn-gray-600"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Community Feedback
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id="testimonials-section" className="py-12 sm:py-20">
        {activeTab === "video" && videoTestimonialData.length > 0 && (
          <VideoCarousel testimonials={videoTestimonialData} />
        )}
        {activeTab === "text" && textTestimonialData.length > 0 && (
          <div className="max-w-7xl mx-auto px-6">
            <TextTestimonialsGrid
              testimonials={textTestimonialData}
              activeFilter={categoryFilter}
              onFilterChange={setCategoryFilter}
            />
          </div>
        )}
        {activeTab === "video" && videoTestimonialData.length === 0 && (
          <div className="max-w-2xl mx-auto px-6 text-center py-32">
            <div className="w-20 h-20 bg-mulearn-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-mulearn-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-mulearn-gray-700 mb-3 ">
              No Video Testimonials Available
            </h3>
            <p className="text-mulearn-gray-500  text-lg">
              Check back soon for video testimonials from our community members.
            </p>
          </div>
        )}

        {activeTab === "text" && textTestimonialData.length === 0 && (
          <div className="max-w-2xl mx-auto px-6 text-center py-32">
            <div className="w-20 h-20 bg-mulearn-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-mulearn-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-mulearn-gray-700 mb-3 ">
              No Text Testimonials Available
            </h3>
            <p className="text-mulearn-gray-500  text-lg">
              Check back soon for community feedback and stories.
            </p>
          </div>
        )}
      </div>

      <div className="py-12 sm:py-20 mb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6">Ready to Share Your Story?</h2>
            <p className="text-xl text-mulearn-gray-600 mb-10  max-w-3xl mx-auto leading-relaxed">
              Join thousands of learners, mentors, and partners who are transforming education
              through collaborative learning
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                variant={"default"}
                className=" px-10 py-4 text-lg font-semibold rounded-2xl"
                onClick={() => (refreshToken ? redirect("/dashboard/home") : redirect("/register"))}
              >
                Join Our Community
              </Button>
              <Link
                href="https://airtable.com/appzJZWzMWidJ0KHo/pagqcMn08HSvFjj7R/form"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant={"default"}
                  className="px-6 sm:px-10 py-3 sm:py-4 text-lg font-semibold"
                >
                  Share Your Experience
                </Button>
              </Link>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}
