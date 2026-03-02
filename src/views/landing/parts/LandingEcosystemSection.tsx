import { BarChart3, ClipboardList, Cog } from "lucide-react";
import { motion } from "framer-motion";
import { LandingSectionMotion } from "./LandingSectionMotion";
import { ecosystemFeatures, type LandingFeatureItem } from "./landingContent";

const iconByFeature: Record<LandingFeatureItem["id"], typeof Cog> = {
    systems: Cog,
    assignment: ClipboardList,
    analytics: BarChart3,
};

const cardsContainerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.14,
            delayChildren: 0.08,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 42, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
};

export const LandingEcosystemSection = () => {
    return (
        <LandingSectionMotion delay={0.05} className="border-b border-slate-200 py-24">
            <h2 className="text-center font-['Abhaya_Libre'] text-6xl leading-tight font-bold ">
                Management Ecosystem
            </h2>
            <motion.div
                variants={cardsContainerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-12 grid gap-8 grid-cols-3"
            >
                {ecosystemFeatures.map((feature) => {
                    const Icon = iconByFeature[feature.id];

                    return (
                        <motion.article
                            key={feature.id}
                            variants={cardVariants}
                            transition={{ duration: 0.62, ease: "easeOut" }}
                            className="flex flex-col gap-4 border border-slate-200 bg-white p-8"
                        >
                            <div className="mb-1 inline-flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50 text-slate-800">
                                <Icon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold leading-tight text-slate-900">
                                {feature.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-500">
                                {feature.description}
                            </p>
                        </motion.article>
                    );
                })}
            </motion.div>
        </LandingSectionMotion>
    );
};
