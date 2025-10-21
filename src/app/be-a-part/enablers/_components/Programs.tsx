"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Programs() {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoClick = () => {
        setIsPlaying(true);
    };

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="font-display mb-12 text-center text-3xl font-bold text-mulearn-blackish md:text-4xl lg:text-5xl">
                        Enablers{" "}
                        <span className="bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
                            Programs
                        </span>{" "}
                        &{" "}
                        <span className="bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
                            Project
                        </span>
                    </h2>

                    <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-mulearn-greyish bg-blue-50/50 p-6 shadow-lg md:p-8">
                        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                            {/* Video Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                {!isPlaying ? (
                                    <div
                                        className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 shadow-md"
                                        onClick={handleVideoClick}
                                    >
                                        {/* Thumbnail with play button */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-mulearn-blackish/90 transition-all duration-300 group-hover:scale-110 group-hover:bg-mulearn-blackish">
                                                    <svg
                                                        className="ml-1 h-8 w-8 fill-white"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Badge */}
                                        <div className="absolute left-4 top-4 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-mulearn-blackish shadow-sm md:text-sm">
                                            µLearn
                                        </div>
                                        {/* Title overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-mulearn-blackish/70 to-transparent p-4 md:p-6">
                                            <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                                                TEACH 3.0
                                            </h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src="https://www.youtube.com/embed/r5izRx-4j68?autoplay=1"
                                            title="Art of Teaching - Teach contest"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0"
                                        ></iframe>
                                    </div>
                                )}
                            </motion.div>

                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="flex flex-col justify-center"
                            >
                                <h3 className="font-display mb-4 text-2xl font-bold text-mulearn-blackish md:text-3xl">
                                    Art of Teaching -{" "}
                                    <span className="bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
                                        Teach contest
                                    </span>
                                </h3>
                                <p className="font-sans mb-6 text-sm leading-relaxed text-mulearn-gray-600 md:text-base">
                                    {/* **FIX: Replaced ' with &apos;** */}
                                    Art of Teaching is an annual event that
                                    spotlights enablers&apos; teaching
                                    talents. They can showcase their skills
                                    through videos, simplifying concepts for
                                    students. In the last edition, we received
                                    150+ video entries and rewarded winners with
                                    cash prizes.
                                </p>
                                <div>
                                    <Button
                                        variant="mulearn"
                                        className="font-sans px-6 py-3 text-sm font-semibold md:text-base"
                                    >
                                        Know More
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}