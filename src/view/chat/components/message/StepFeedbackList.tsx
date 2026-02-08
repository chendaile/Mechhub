import React from "react";
import { GradingStep } from "@features/chat/types/message";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { MarkdownRenderer } from "../../../../components";

interface StepFeedbackListProps {
    steps: GradingStep[];
    activeStepIndex: number | null;
    onSelectStep: (index: number) => void;
    stepRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
    stepListContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const StepFeedbackList: React.FC<StepFeedbackListProps> = ({
    steps,
    activeStepIndex,
    onSelectStep,
    stepRefs,
    stepListContainerRef,
}) => {
    return (
        <div className="p-2 bg-slate-50 h-full min-h-0 flex flex-col">
            <h4 className="font-bold text-lg text-slate-800 shrink-0 flex items-center justify-center mb-2">
                AI Feedback Breakdown
            </h4>

            <div
                ref={stepListContainerRef}
                className="space-y-4 flex-1 min-h-0 overflow-y-auto pr-2"
            >
                {steps.map((step, idx) => (
                    <motion.div
                        key={step.stepNumber}
                        ref={(el) => {
                            if (el) stepRefs.current.set(idx, el);
                        }}
                        onClick={() => onSelectStep(idx)}
                        animate={{
                            scale: activeStepIndex === idx ? 1.02 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                        className={`bg-white rounded-xl p-4 m-2 cursor-pointer border-2 transition-colors ${
                            activeStepIndex === idx
                                ? "border-slate-800 shadow-lg"
                                : "border-transparent hover:border-slate-200"
                        }`}
                    >
                        {/* 标题行 */}
                        <div className="flex items-center gap-2 mb-2">
                            {step.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                            <span className="font-bold text-slate-800">
                                Step {step.stepNumber}: {step.stepTitle}
                            </span>
                        </div>

                        {/* 评语 */}
                        <div className="text-sm text-slate-600 leading-relaxed pl-7">
                            <MarkdownRenderer content={step.comment} />
                        </div>

                        {/* 公式 */}
                        {step.formula && step.formula.trim() !== "" && (
                            <div className="mt-3 ml-7 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    公式
                                </div>
                                <div className="text-sm text-slate-700">
                                    <MarkdownRenderer content={step.formula} />
                                </div>
                            </div>
                        )}

                        {/* 文字说明 */}
                        {step.text && step.text.trim() !== "" && (
                            <div className="mt-3 ml-7 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    文字说明
                                </div>
                                <div className="text-sm text-slate-700 leading-relaxed">
                                    <MarkdownRenderer content={step.text} />
                                </div>
                            </div>
                        )}

                        {/* 修正公式（仅错误步骤） */}
                        {!step.isCorrect &&
                            step.correctFormula &&
                            step.correctFormula.trim() !== "" && (
                                <div className="mt-3 ml-7 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                                    <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                                        正确修正公式
                                    </div>
                                    <div className="text-sm text-emerald-800">
                                        <MarkdownRenderer
                                            content={step.correctFormula}
                                        />
                                    </div>
                                </div>
                            )}

                        {/* 建议（如果有） */}
                        {step.suggestion && (
                            <div className="mt-3 ml-7 flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-700 leading-relaxed">
                                    <MarkdownRenderer
                                        content={step.suggestion}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


