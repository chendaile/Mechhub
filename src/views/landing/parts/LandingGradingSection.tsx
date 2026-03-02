import { CheckCircle2, PencilLine } from "lucide-react";
import { motion } from "framer-motion";
import { LandingSectionMotion } from "./LandingSectionMotion";
import { gradingContent } from "./landingContent";

const PAPER_LINES = 7;

export const LandingGradingSection = () => {
    return (
        <LandingSectionMotion className="border-b border-slate-200 py-24">
            <div className="flex flex-col-reverse items-center gap-16 lg:flex-row-reverse">
                <motion.div
                    initial={{ opacity: 0, x: 46, y: 24 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full lg:w-1/3"
                >
                    <h2 className="font-['Abhaya_Libre'] text-5xl leading-tight font-bold text-slate-900">
                        Automated
                        <br />
                        Grading
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-slate-600">
                        {gradingContent.description}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -46, y: 24 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                        duration: 0.75,
                        delay: 0.06,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full lg:w-2/3"
                >
                    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
                        <article className="border border-slate-200 bg-white p-7">
                            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <PencilLine size={16} />
                                Submission Draft
                            </p>
                            <div className="space-y-2">
                                {Array.from({ length: PAPER_LINES }).map((_, index) => (
                                    <div
                                        key={`paper-line-${index + 1}`}
                                        className="h-4 border border-slate-200 bg-slate-50"
                                    />
                                ))}
                            </div>
                            <ul className="mt-5 space-y-2">
                                {gradingContent.annotations.map((item) => (
                                    <li
                                        key={item}
                                        className="text-sm leading-relaxed text-slate-700"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="border border-slate-200 bg-white p-5">
                            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <CheckCircle2 size={16} />
                                AI Feedback
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <p className="mb-1 text-xs font-bold tracking-wider text-green-600 uppercase">
                                        Corrections
                                    </p>
                                    <ul className="space-y-1 text-xs leading-relaxed text-slate-600">
                                        {gradingContent.corrections.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                                        {gradingContent.gradeLabel}
                                    </span>
                                    <span className="text-lg font-bold text-slate-900">
                                        {gradingContent.gradeValue}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>
                </motion.div>
            </div>
        </LandingSectionMotion>
    );
};
