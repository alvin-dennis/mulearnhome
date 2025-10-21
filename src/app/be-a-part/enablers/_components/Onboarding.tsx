"use client";

import { motion } from "framer-motion";
import MuImage from "@/components/MuImage";

const steps = [
    {
        number: "01",
        title: "Create µLearn Profile",
        description:
            "Enablers should create a profile via app.mulearn.org, and they should ensure to register as a faculty member by choosing the option 'I'm teaching in an Institute'. Once you get a profile, go to 'Connect Discord' and join our Discord server.",
    },
    {
        number: "02",
        title: "Welcome to Discord",
        description:
            "Once you join the server, our bot, Aaronchetan will send you a DM asking you to connect your µ-ID, which is provided in the µlearn profile. Once it's connected, you can start your onboarding process.",
    },
    {
        number: "03",
        title: "Add Interest Groups",
        description:
            "Now you will have access to the #lvl1-info channel, and as you do the tasks, you will progress through the levels. Once you reach level 4, you will have the option to edit Interest Groups on your µlearn profile page.",
        icon: "💡",
    },
];

export default function Onboarding() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="font-display mb-16 text-center text-3xl font-bold text-mulearn-blackish md:text-4xl lg:text-5xl">
                    Onboarding{" "}
                    <span className="bg-gradient-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent">
                        Process
                    </span>
                </h2>

                <div className="grid gap-8 md:grid-cols-3 md:gap-6">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: idx * 0.1,
                            }}
                            className="relative flex flex-col items-center"
                        >
                            {/* Connecting dashed line */}
                            {idx < steps.length - 1 && (
                                <div
                                    className="absolute left-[calc(50%+3rem)] top-12 hidden h-0.5 w-[calc(100%-6rem)] border-t-2 border-dashed border-mulearn-blackish/30 md:block"
                                    style={{ zIndex: 0 }}
                                />
                            )}

                            {/* Icon Circle */}
                            <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-mulearn-trusty-blue to-mulearn-duke-purple shadow-lg">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                                    {typeof step.icon === "string" &&
                                    (step.icon.startsWith("/") ||
                                        step.icon.startsWith("http")) ? (
                                        // **FIX: Replaced <img> with <Image> and added width/height**
                                        <MuImage
                                            src={step.icon}
                                            alt={`${step.title} icon`}
                                            width={40}
                                            height={40}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <span className="font-display text-3xl font-bold text-mulearn-trusty-blue">
                                            {step.icon}
                                        </span>
                                    )}
                                </div>
                                {/* Step number badge */}
                                <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-mulearn-blackish text-xs font-bold text-white shadow-md">
                                    {step.number}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h3 className="font-display mb-3 text-xl font-bold text-mulearn-blackish">
                                    {step.title}
                                </h3>
                                <p className="font-sans text-sm leading-relaxed text-mulearn-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}