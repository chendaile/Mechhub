import React from "react";
import { motion } from "motion/react";
import { MechHubLogo } from "../../components";
import { Button } from "../../components/ui/button";
import { cardVariants } from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { useLandingPageState } from "@hook/landing/ui/useLandingPageState";

interface LandingPageProps {
    onStart: () => void;
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
    onStart,
    onLogin,
}) => {
    const { handleStart, handleLogin } = useLandingPageState(
        onStart,
        onLogin,
    );
    return (
        <div className="min-h-screen bg-canvas-alt flex items-center justify-center p-(--space-4) md:p-(--space-8) font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                    cardVariants({ radius: "hero", shadow: "sm" }),
                    "w-full max-w-7xl relative min-h-(--size-landing-card-min-h) flex flex-col md:flex-row overflow-hidden",
                )}
            >
                {/* Decorative Background Nodes */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 800 600"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        {/* Left Side Nodes */}
                        <line
                            x1="50"
                            y1="100"
                            x2="200"
                            y2="250"
                            stroke="var(--color-border-subtle)"
                            strokeWidth="1"
                        />
                        <line
                            x1="50"
                            y1="300"
                            x2="200"
                            y2="250"
                            stroke="var(--color-border-subtle)"
                            strokeWidth="1"
                        />
                        <line
                            x1="50"
                            y1="100"
                            x2="50"
                            y2="300"
                            stroke="var(--color-border-subtle)"
                            strokeWidth="1"
                        />
                        <circle
                            cx="50"
                            cy="100"
                            r="3"
                            fill="var(--color-focus-ring)"
                        />
                        <circle
                            cx="200"
                            cy="250"
                            r="3"
                            fill="var(--color-focus-ring)"
                        />
                        <circle
                            cx="50"
                            cy="300"
                            r="3"
                            fill="var(--color-focus-ring)"
                        />

                        {/* Right Side Nodes - extending from top right */}
                        <line
                            x1="700"
                            y1="50"
                            x2="600"
                            y2="150"
                            stroke="var(--color-border-subtle)"
                            strokeWidth="1"
                        />
                        <line
                            x1="750"
                            y1="200"
                            x2="600"
                            y2="150"
                            stroke="var(--color-border-subtle)"
                            strokeWidth="1"
                        />
                        <circle
                            cx="700"
                            cy="50"
                            r="3"
                            fill="var(--color-focus-ring)"
                        />
                        <circle
                            cx="600"
                            cy="150"
                            r="3"
                            fill="var(--color-focus-ring)"
                        />
                        <circle
                            cx="750"
                            cy="200"
                            r="3"
                            fill="var(--color-focus-ring)"
                        />
                    </svg>
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row p-(--space-8) md:p-12 lg:p-16">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col justify-between">
                        {/* Logo */}
                        <MechHubLogo />

                        {/* Main Text */}
                        <div className="my-12 md:my-0 flex-1 flex flex-col justify-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight font-['Abhaya_Libre'] mb-10"
                            >
                                Theoretical Mechanics,
                                <br />
                                Reimagined by AI.
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Button
                                    onClick={handleStart}
                                    size="lg"
                                    className="hover:scale-105"
                                >
                                    Start Now
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column / Login Button Area */}
                    <div className="flex-1 flex flex-col items-center md:items-end justify-between relative">
                        {/* Login Button - Absolute Top Right relative to the container padding, but we can make it part of the flex flow if we want it aligned with the logo visually, but typically it's top right of the card */}
                        <div className="w-full flex justify-end mb-8 md:mb-0">
                            <Button
                                onClick={handleLogin}
                                variant="outline"
                                size="md"
                            >
                                Login
                            </Button>
                        </div>

                        {/* Gyroscope Image - Centered in remaining space */}
                        <div className="flex-1 flex items-center justify-center w-full min-h-(--size-landing-image-min-h)">
                            <motion.div
                                animate={{
                                    y: [0, -15, 0], // Floating effect
                                }}
                                transition={{
                                    y: {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}
                                className="w-full max-w-(--size-landing-image-max-w) aspect-square relative"
                            >
                                <img
                                    src="https://cdn.builder.io/api/v1/image/assets%2F31b33db0871d4fe191b620f6b8c8dbda%2F5b0b4634fb5e430086e8d0a8803c7279"
                                    alt="Gyroscope"
                                    className="w-full h-full object-contain drop-shadow-xl"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
