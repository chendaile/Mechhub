import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowRight,
    GraduationCap,
    CheckCircle,
    Paperclip,
    X,
    Loader2,
    FileText,
    Square,
} from "lucide-react";
import { SubmitMessage } from "@features/chat/types/message";
import { useSendState } from "@hook/chat/ui/useSendState";
import { ChatMode } from "@features/chat/types/message";
import {
    UploadImageHandler,
    useAttachmentUploadState,
} from "@hook/chat/ui/useAttachmentUploadState";

interface UnifiedInputBarProps {
    onSendMessage: (payload: SubmitMessage) => void;
    uploadImage: UploadImageHandler;
    mode: ChatMode;
    setMode: (mode: ChatMode) => void;
    model: string;
    setModel: (model: string) => void;
    placeholder?: string;
    isTyping?: boolean;
    onStop?: () => void;
}

const MODEL_OPTIONS = [
    "qwen3-vl-235b-a22b-thinking",
    "qwen3-vl-235b-a22b-instruct",
    "qwen3-vl-32b-thinking",
    "qwen3-vl-32b-instruct",
];

export const UnifiedInputBar = ({
    onSendMessage,
    uploadImage,
    mode,
    setMode,
    model,
    setModel,
    placeholder,
    isTyping = false,
    onStop,
}: UnifiedInputBarProps) => {
    const {
        fileInputRef,
        imageAttachments,
        fileAttachments,
        isUploading,
        uploadedImageUrls,
        handleUploadClick,
        handleFileChange,
        removeImageAttachment,
        removeFileAttachment,
        resetAttachments,
    } = useAttachmentUploadState({ uploadImage });

    const {
        inputValue,
        setInputValue,
        submitDraft,
    } = useSendState({
        mode,
        model,
        isUploading,
        uploadedImageUrls,
        fileAttachments,
        resetAttachments,
    });

    const handleSubmit = (e?: { preventDefault: () => void }) => {
        e?.preventDefault();
        const payload = submitDraft();
        if (payload) {
            onSendMessage(payload);
        }
    };

    const showStopButton = isTyping && !!onStop;
    const modeButtonClass =
        "relative z-10 flex w-[100px] items-center justify-center gap-2 rounded-[20px] px-4 py-2 text-xs font-bold transition-colors";

    return (
        <form onSubmit={handleSubmit} className="w-full relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.txt,.py,.js,.java,.cpp,.c,.go,.rs,.rb,.php,.ts,.tsx,.jsx,.sql,.html,.css,.json,.yaml,.yml,.xml,.md,.markdown,.sh,.bash"
                multiple
                onChange={handleFileChange}
            />

            {/* Attachments Preview Area */}
            <AnimatePresence>
                {(imageAttachments.length > 0 ||
                    fileAttachments.length > 0) && (
                    <div className="flex gap-2 mb-2 px-2 overflow-x-auto pb-2">
                        {/* Image Attachments */}
                        {imageAttachments.map((att) => (
                            <motion.div
                                key={att.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 group"
                            >
                                <img
                                    src={att.previewUrl}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                {att.uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-white w-5 h-5" />
                                    </div>
                                )}
                                {!att.uploading && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeImageAttachment(att.id)
                                        }
                                        className="absolute top-1 right-1 bg-white text-slate-700 rounded-full p-1 shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors z-10"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </motion.div>
                        ))}

                        {/* File Attachments */}
                        {fileAttachments.map((att) => (
                            <motion.div
                                key={att.filename}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 shadow-sm shrink-0 group flex items-center gap-2"
                            >
                                <FileText
                                    size={14}
                                    className="text-slate-600"
                                />
                                <span className="text-xs text-slate-700 truncate max-w-[80px]">
                                    {att.filename}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeFileAttachment(att.filename)
                                    }
                                    className="ml-1 text-slate-400 hover:text-slate-600 p-0.5 hover:bg-slate-200 rounded"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors rounded-[32px] p-2 border border-slate-200 focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100 shadow-sm">
                {/* Integrated Mode Switcher */}
                <div className="relative mr-1 flex shrink-0 rounded-[24px] border border-slate-200 bg-white/80 p-1">
                    <motion.div
                        className="absolute top-1 bottom-1 bg-slate-900 rounded-[20px] shadow-sm z-0"
                        layoutId="activeModeInputUnified"
                        initial={false}
                        animate={{
                            left: mode === "study" ? "4px" : "calc(50% + 2px)",
                            width: "calc(50% - 6px)",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => setMode("study")}
                        className={`${modeButtonClass} ${
                            mode === "study"
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <GraduationCap size={14} />
                        提问
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("correct")}
                        className={`${modeButtonClass} ${
                            mode === "correct"
                                ? "text-white"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <CheckCircle size={14} />
                        批改
                    </button>
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-[20px] border border-slate-200 bg-white/80 px-2 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        模型
                    </span>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="bg-transparent text-xs text-slate-700 outline-none"
                    >
                        {MODEL_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <textarea
                    ref={(el) => {
                        if (el) {
                            el.style.height = "auto";
                            el.style.height =
                                Math.min(el.scrollHeight, 200) + "px";
                        }
                    }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                        placeholder ||
                        (mode === "correct" ? "上传你的解答." : "提出你的疑问.")
                    }
                    rows={1}
                    className="flex-1 min-w-0 resize-none overflow-y-auto bg-transparent border-none outline-none py-3 px-2 text-lg text-slate-700 placeholder:text-slate-400 max-h-[200px]"
                    onKeyDown={(e) => {
                        if (e.nativeEvent.isComposing) return;
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />

                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="p-3 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                    title="上传文件（图片或文本）"
                >
                    <Paperclip size={20} />
                </button>

                <button
                    type="button"
                    onClick={(e) => {
                        if (showStopButton && onStop) {
                            onStop();
                        } else {
                            handleSubmit(e);
                        }
                    }}
                    disabled={
                        !showStopButton &&
                        ((!inputValue.trim() &&
                            imageAttachments.length === 0 &&
                            fileAttachments.length === 0) ||
                            isUploading ||
                            isTyping)
                    }
                    className={`p-3 rounded-full transition-all shadow-md ml-1 flex items-center justify-center ${
                        showStopButton
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title={showStopButton ? "停止生成" : "发送消息"}
                >
                    {isUploading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : showStopButton ? (
                        <Square size={16} fill="currentColor" />
                    ) : (
                        <ArrowRight size={20} />
                    )}
                </button>
            </div>
        </form>
    );
};

