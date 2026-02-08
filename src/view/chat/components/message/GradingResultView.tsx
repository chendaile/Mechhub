import React, { useState } from "react";
import { GradingResult } from "@features/chat/types/message";
import { AIAvatar, MarkdownRenderer } from "../../../../components";
import { ImageGradingPanel } from "./ImageGradingPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThinkingPanel } from "./ThinkingPanel";

interface GradingResultViewProps {
    gradingResult: GradingResult;
    reply?: string;
    reasoning?: string;
    showThinking?: boolean;
}

export const GradingResultView: React.FC<GradingResultViewProps> = ({
    gradingResult,
    reply,
    reasoning,
    showThinking = false,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const hasReply = !!reply && reply.trim().length > 0;

    // Debug logging
    console.log("[GradingResultView] gradingResult:", gradingResult);
    console.log(
        "[GradingResultView] images:",
        gradingResult.imageGradingResult,
    );

    const images = gradingResult.imageGradingResult || [];
    const hasMultipleImages = images.length > 1;
    const currentImage = images[currentImageIndex];

    const goToPrev = () => {
        setCurrentImageIndex((prev) =>
            prev > 0 ? prev - 1 : images.length - 1,
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            prev < images.length - 1 ? prev + 1 : 0,
        );
    };

    return (
        <div className="w-full">
            {/* Prominent Header with Enhanced Styling */}
            <div className="flex items-center gap-3 mb-6">
                <AIAvatar isThinking={false} />
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900">
                        批改结果
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        详细的作业批改报告
                    </p>
                </div>
            </div>

            {/* Enhanced Summary Card with Better Visual Hierarchy */}
            <div className="bg-fill-muted rounded-3xl p-4">
                <div className="flex items-start gap-3 mb-4">
                    <div className="shrink-0 w-1 h-10 bg-slate-900 rounded-full" />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                            总体评价
                        </h3>
                        <div className="text-base leading-relaxed text-slate-900">
                            <MarkdownRenderer content={gradingResult.summary} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={() => setShowAnalysis((prev) => !prev)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-slate-300 hover:text-slate-800 transition-colors"
                >
                    {showAnalysis ? "隐藏思考与正文" : "查看思考与正文"}
                </button>

                {showAnalysis && (
                    <div className="mt-3 space-y-3">
                        <ThinkingPanel
                            label="思考过程"
                            reasoning={reasoning}
                            show={showThinking}
                            defaultOpen={true}
                        />

                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                正文回复
                            </div>
                            {hasReply ? (
                                <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                                    {reply}
                                </pre>
                            ) : (
                                <div className="text-sm text-slate-500">
                                    暂无正文回复
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Navigation Section */}
            {hasMultipleImages && (
                <div className="flex items-center justify-center gap-6 mb-8 px-4 py-3 bg-slate-50 rounded-2xl">
                    <button
                        onClick={goToPrev}
                        className="p-3 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-slate-700"
                        aria-label="上一张"
                    >
                        <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    <span className="text-base font-semibold text-slate-700 min-w-max">
                        图片 {currentImageIndex + 1} / {images.length}
                    </span>
                    <button
                        onClick={goToNext}
                        className="p-3 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-slate-700"
                        aria-label="下一张"
                    >
                        <ChevronRight size={20} strokeWidth={2} />
                    </button>
                </div>
            )}

            {/* Current Image Grading Panel */}
            {currentImage ? (
                <div className="mb-2 border-2 border-black rounded-3xl overflow-hidden shadow-lg">
                    <ImageGradingPanel imageGrading={currentImage} />
                </div>
            ) : (
                <div className="bg-slate-100 rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
                    <p className="font-semibold">未找到图片数据</p>
                    <p className="text-xs mt-2">
                        images: {JSON.stringify(images)}
                    </p>
                </div>
            )}
        </div>
    );
};


