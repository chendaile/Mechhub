import { motion } from "framer-motion";
import { LandingBackground } from "./parts/LandingBackground";
import { LandingEcosystemSection } from "./parts/LandingEcosystemSection";
import { LandingFooter } from "./parts/LandingFooter";
import { LandingGradingSection } from "./parts/LandingGradingSection";
import { LandingHeader } from "./parts/LandingHeader";
import { LandingHero } from "./parts/LandingHero";
import { LandingImage } from "./parts/LandingImage";
import { LandingTeachingSection } from "./parts/LandingTeachingSection";
import { LandingUIState } from "@hooks/landing/ui/LandingUIState";

interface LandingPageViewProps {
    onStart: () => void;
    onLogin: () => void;
}

export const LandingPageView = ({ onStart, onLogin }: LandingPageViewProps) => {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">
            <LandingHeader onLogin={onLogin} />
            <motion.main
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="min-h-0 flex-1 overflow-y-auto"
            >
                <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-6 pb-16 ">
                    <section className="relative p-12">
                        <div className="pointer-events-none absolute inset-0">
                            <LandingBackground />
                        </div>
                        <div className="relative grid min-h-[76vh] items-center grid-cols-2">
                            <LandingHero onStart={onStart} />
                            <LandingImage />
                        </div>
                    </section>

                    <LandingEcosystemSection />
                    <LandingTeachingSection />
                    <LandingGradingSection />
                    <LandingFooter />
                </div>
            </motion.main>
        </div>
    );
};

type LandingPageStateProps = ReturnType<typeof LandingUIState>;

const createLandingPageView = ({ handleStart, handleLogin }: LandingPageStateProps) => {
    return <LandingPageView onStart={handleStart} onLogin={handleLogin} />;
};

export const LandingPageContainer = ({ onStart, onLogin }: LandingPageViewProps) => {
    const state = LandingUIState(onStart, onLogin);
    return createLandingPageView(state);
};
