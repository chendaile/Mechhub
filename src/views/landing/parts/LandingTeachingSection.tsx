import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { LandingSectionMotion } from "./LandingSectionMotion";
import { teachingContent } from "./landingContent";

export const LandingTeachingSection = () => {
    return (
        <LandingSectionMotion className="border-b border-slate-200 py-24">
            <div className="flex flex-col items-center gap-16 lg:flex-row">
                <motion.div
                    initial={{ opacity: 0, x: -46, y: 24 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full lg:w-1/3"
                >
                    <h2 className="font-['Abhaya_Libre'] text-5xl leading-tight font-bold text-slate-900">
                        AI-Powered
                        <br />
                        Teaching
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-slate-600">
                        {teachingContent.description}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 46, y: 24 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                        duration: 0.75,
                        delay: 0.06,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full lg:w-2/3"
                >
                    <div className="border border-slate-200 bg-white p-6">
                        <div className="mb-8 flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-300 bg-slate-100 text-slate-600">
                                <MessageCircle size={18} />
                            </div>
                            <div className="max-w-[85%]">
                                <p className="mb-1 text-xs font-bold text-slate-400">Teacher</p>
                                <div className="border border-slate-200 bg-slate-50 px-5 py-3">
                                    <p className="text-sm text-slate-800">
                                        {teachingContent.teacherPrompt}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black bg-black text-white">
                                <Sparkles size={18} />
                            </div>
                            <div className="max-w-[90%]">
                                <p className="mb-1 text-xs font-bold text-slate-400">AI Tutor</p>
                                <div className="border border-slate-200 bg-white px-6 py-5 text-sm">
                                    <h3 className="mb-2 text-sm font-bold text-slate-900">
                                        {teachingContent.aiSummary}
                                    </h3>
                                    <div className="space-y-3 text-slate-600">
                                        <div>
                                            <p className="mb-1 text-xs font-semibold tracking-wide text-slate-700 uppercase">
                                                Objectives
                                            </p>
                                            <ul className="list-disc space-y-1 pl-4">
                                                {teachingContent.objectives.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-semibold tracking-wide text-slate-700 uppercase">
                                                Resources
                                            </p>
                                            <ul className="list-disc space-y-1 pl-4">
                                                {teachingContent.resources.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </LandingSectionMotion>
    );
};
