import { ZoomIn, Copy, Check, Share2, Upload } from "lucide-react";
import type { RefObject } from "react";
import { FileAttachment } from "../types";
import { AIAvatar } from "../../shared/AIAvatar";
import { MarkdownRenderer } from "../../shared/MarkdownRenderer";
import { FileAttachmentPreview } from "./FileAttachmentPreview";
import { DetailPanel } from "./DetailPanel";
import styles from "../../shared/scrollbar.module.css";

interface TextMessageViewProps {
    role: "user" | "assistant";
    text: string;
    reasoning?: string;
    showThinking?: boolean;
    thinkingOpen: boolean;
    onToggleThinking: () => void;
    thinkingContentRef?: RefObject<HTMLDivElement | null>;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    isAttachmentExpanded: (index: number) => boolean;
    onToggleAttachment: (index: number) => void;
    onImageClick: (url: string) => void;
    isGenerating?: boolean;
    isCopied: boolean;
    onCopy: () => void;
    onShareToClass?: () => void;
    onSubmitToAssignment?: () => void;
    showActions?: boolean;
}

export const TextMessageView = ({
    role,
    text,
    reasoning,
    showThinking = false,
    thinkingOpen,
    onToggleThinking,
    thinkingContentRef,
    imageUrls,
    fileAttachments,
    isAttachmentExpanded,
    onToggleAttachment,
    onImageClick,
    isGenerating = false,
    isCopied,
    onCopy,
    onShareToClass,
    onSubmitToAssignment,
    showActions = true,
}: TextMessageViewProps) => {
    const displayImages = imageUrls && imageUrls.length > 0 ? imageUrls : [];
    const canShowThinking = role === "assistant" && showThinking;

    return (
        <div className={`flex ${role === "user" ? "flex-row-reverse" : "relative pl-12"}`}>
            {role === "assistant" && (
                <div className="absolute left-0 top-0 flex items-center gap-2">
                    <AIAvatar isThinking={isGenerating} />
                </div>
            )}

            <div
                className={`flex flex-col gap-1 max-w-[90%] min-w-0 ${role === "user" ? "items-end" : "items-start"}`}
            >
                {displayImages.length > 0 && (
                    <div
                        className={`mb-2 flex flex-wrap gap-2 ${role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {displayImages.map((url, idx) => (
                            <div
                                key={idx}
                                className="relative rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm cursor-zoom-in group transition-transform hover:scale-[1.02]"
                                onClick={() => onImageClick(url)}
                                style={{ width: "120px", height: "120px" }}
                            >
                                <img
                                    src={url}
                                    alt={`Attachment ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/10">
                                    <ZoomIn
                                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                                        size={20}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {fileAttachments && fileAttachments.length > 0 && (
                    <div className="mb-2 space-y-2">
                        {fileAttachments.map((file, index) => (
                            <FileAttachmentPreview
                                key={`${file.filename}-${index}`}
                                file={file}
                                role={role}
                                isExpanded={isAttachmentExpanded(index)}
                                onToggleExpanded={() => onToggleAttachment(index)}
                            />
                        ))}
                    </div>
                )}

                <DetailPanel
                    label="思考过程"
                    content={reasoning}
                    show={canShowThinking}
                    open={thinkingOpen}
                    onToggle={onToggleThinking}
                    contentRef={thinkingContentRef}
                />

                {text && text.trim() && (
                    <div className="group flex flex-col gap-2">
                        <div
                            className={`text-base leading-loose p-3 overflow-y-auto min-w-0 ${styles.scrollbar} ${
                                role === "user"
                                    ? "bg-slate-900 text-white rounded-[1.5rem] rounded-tr-[0.125rem]"
                                    : "bg-[#f8fafc] border-none text-slate-700 rounded-none"
                            }`}
                        >
                            {role === "user" ? text : <MarkdownRenderer content={text} />}
                        </div>

                        {showActions && (
                            <div
                                className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                    role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                {onShareToClass && (
                                    <button
                                        onClick={onShareToClass}
                                        className={`px-3 py-1.5 rounded-[1rem] transition-all duration-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            role === "user"
                                                ? "text-slate-400 hover:bg-slate-800/50 hover:text-white focus:ring-slate-600 focus:ring-offset-slate-900"
                                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus:ring-slate-300 focus:ring-offset-white"
                                        }`}
                                        aria-label="分享到班级"
                                        title="Share to Class"
                                    >
                                        <Share2 size={14} />
                                        <span>分享班级</span>
                                    </button>
                                )}

                                {onSubmitToAssignment && (
                                    <button
                                        onClick={onSubmitToAssignment}
                                        className={`px-3 py-1.5 rounded-[1rem] transition-all duration-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            role === "user"
                                                ? "text-slate-400 hover:bg-slate-800/50 hover:text-white focus:ring-slate-600 focus:ring-offset-slate-900"
                                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-700 focus:ring-slate-300 focus:ring-offset-white"
                                        }`}
                                        aria-label="提交到作业"
                                        title="提交到作业"
                                    >
                                        <Upload size={14} />
                                        <span>提交作业</span>
                                    </button>
                                )}

                                <button
                                    onClick={onCopy}
                                    className={`px-3 py-1.5 rounded-[1rem] transition-all duration-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        role === "user"
                                            ? `${
                                                  isCopied
                                                      ? "bg-slate-800 text-green-400"
                                                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                              } focus:ring-slate-600 focus:ring-offset-slate-900`
                                            : `${
                                                  isCopied
                                                      ? "bg-slate-100/50 text-green-600"
                                                      : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                                              } focus:ring-slate-300 focus:ring-offset-white`
                                    }`}
                                    aria-label={isCopied ? "已复制到剪贴板" : "复制文本内容"}
                                    title={isCopied ? "已复制到剪贴板" : "复制文本"}
                                >
                                    {isCopied ? (
                                        <>
                                            <Check size={14} />
                                            <span>已复制</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>复制</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
