import React from "react";
import { ImageGradingResult } from "@features/chat/types/message";
import { StepAnnotationBox } from "./StepAnnotationBox";
import { StepFeedbackList } from "./StepFeedbackList";
import {
    X,
    ZoomIn,
    ChevronRight,
    ChevronLeft,
    Minus,
    Plus,
    RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useImageGradingPanelState } from "@hook/chat/ui/useImageGradingPanelState";

interface ImageGradingPanelProps {
    imageGrading: ImageGradingResult;
}

export const ImageGradingPanel: React.FC<ImageGradingPanelProps> = ({
    imageGrading,
}) => {
    const {
        showDetail,
        openDetail,
        closeDetail,
        isSidebarOpen,
        toggleSidebar,
        activeStepIndex,
        handleSelectStep,
        stepRefs,
        stepListContainerRef,
        // Zoom & Pan
        scale,
        position,
        isDragging,
        handleZoomIn,
        handleZoomOut,
        handleReset,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    } = useImageGradingPanelState();

    return (
        <>
            {/* Enhanced Compact Card View - Larger and More Prominent */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                <div
                    className="relative w-full bg-linear-to-b from-slate-50 to-slate-100 cursor-pointer group border-b border-slate-100 flex items-center justify-center overflow-hidden"
                    onClick={openDetail}
                    style={{ aspectRatio: "4/3", minHeight: "320px" }}
                >
                    <div className="relative inline-block max-w-full max-h-full group-hover:scale-105 transition-transform duration-300">
                        <img
                            src={imageGrading.imageUrl}
                            alt="作业图片"
                            className="block max-w-full max-h-full object-contain"
                        />
                        {imageGrading.steps?.map((step) => (
                            <StepAnnotationBox
                                key={step.stepNumber}
                                step={step}
                                isActive={false}
                                onSelect={openDetail}
                                isCompact={true}
                            />
                        ))}
                    </div>
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition-colors group-hover:bg-black/10">
                        <motion.div className="rounded-full bg-white/95 px-6 py-3 shadow-xl opacity-0 transition-all translate-y-4 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                <ZoomIn size={18} /> 查看详情
                            </span>
                        </motion.div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                            批改步骤
                        </span>
                        <span className="text-sm font-semibold text-slate-500">
                            共 {imageGrading.steps?.length || 0} 步
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {imageGrading.steps?.map((step) => (
                            <motion.div
                                key={step.stepNumber}
                                whileHover={{ scale: 1.1 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md border-2 cursor-pointer transition-all hover:shadow-lg ${
                                    step.isCorrect
                                        ? "bg-green-500 border-green-600 text-white"
                                        : "bg-red-500 border-red-600 text-white"
                                }`}
                                title={`Step ${step.stepNumber}: ${step.stepTitle} - ${step.isCorrect ? "正确" : "错误"}`}
                                onClick={openDetail}
                            >
                                {step.stepNumber}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 全屏详情弹窗 */}
            <AnimatePresence>
                {showDetail && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm"
                        onClick={closeDetail}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300,
                            }}
                            className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
                                <h3 className="text-xl font-bold text-slate-800">
                                    详细批改报告
                                </h3>
                                <button
                                    onClick={closeDetail}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-row overflow-hidden bg-slate-50 relative min-h-0">
                                <div
                                    className={`flex-1 relative min-w-0 bg-slate-200/50 flex flex-col items-center justify-center overflow-hidden p-4 select-none transition-all duration-300 ease-spring ${
                                        isDragging
                                            ? "cursor-grabbing"
                                            : "cursor-grab"
                                    }`}
                                    style={{
                                        marginRight: isSidebarOpen ? 320 : 0,
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    <div
                                        className="relative shadow-2xl rounded-lg bg-white border border-slate-200 max-w-full max-h-full flex flex-col origin-center transition-transform duration-100 ease-out"
                                        style={{
                                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                        }}
                                    >
                                        <img
                                            src={imageGrading.imageUrl}
                                            alt="作业图片"
                                            className="block max-w-full max-h-full object-contain pointer-events-none"
                                            style={{
                                                maxHeight: "calc(90vh - 100px)",
                                            }}
                                        />
                                        {imageGrading.steps?.map(
                                            (step, idx) => (
                                                <StepAnnotationBox
                                                    key={step.stepNumber}
                                                    step={step}
                                                    isActive={
                                                        activeStepIndex === idx
                                                    }
                                                    onSelect={() =>
                                                        handleSelectStep(idx)
                                                    }
                                                    isCompact={false}
                                                />
                                            ),
                                        )}
                                    </div>

                                    {/* 悬浮缩放控制条 */}
                                    <div
                                        className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-lg border border-slate-200 rounded-full px-4 py-2 flex items-center gap-4 z-10"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={handleZoomOut}
                                            className="text-slate-600 hover:text-blue-600 transition-colors p-1"
                                            title="缩小"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="text-sm font-semibold text-slate-700 w-12 text-center select-none">
                                            {Math.round(scale * 100)}%
                                        </span>
                                        <button
                                            onClick={handleZoomIn}
                                            className="text-slate-600 hover:text-blue-600 transition-colors p-1"
                                            title="放大"
                                        >
                                            <Plus size={20} />
                                        </button>
                                        <div className="w-px h-4 bg-slate-300"></div>
                                        <button
                                            onClick={handleReset}
                                            className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 px-1"
                                            title="重置视图"
                                        >
                                            <RotateCcw size={16} />
                                            <span className="text-xs">
                                                重置
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {isSidebarOpen && (
                                        <motion.div
                                            initial={{ x: "100%", opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: "100%", opacity: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                            className="absolute right-0 top-0 bottom-0 w-80 border-l border-slate-200 bg-white shadow-xl z-20 flex flex-col overflow-hidden"
                                        >
                                            <StepFeedbackList
                                                steps={imageGrading.steps || []}
                                                activeStepIndex={
                                                    activeStepIndex
                                                }
                                                onSelectStep={handleSelectStep}
                                                stepRefs={stepRefs}
                                                stepListContainerRef={
                                                    stepListContainerRef
                                                }
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    onClick={toggleSidebar}
                                    initial={false}
                                    animate={{ right: isSidebarOpen ? 320 : 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                    className="absolute top-1/2 z-30 -translate-y-1/2 rounded-l-lg border border-slate-200 bg-white p-1.5 shadow-md hover:bg-slate-50 hover:text-blue-600"
                                    style={{
                                        borderRight: isSidebarOpen
                                            ? "none"
                                            : "1px solid #e2e8f0",
                                    }}
                                    title={
                                        isSidebarOpen ? "收起列表" : "展开列表"
                                    }
                                >
                                    {isSidebarOpen ? (
                                        <ChevronRight size={20} />
                                    ) : (
                                        <ChevronLeft size={20} />
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};


