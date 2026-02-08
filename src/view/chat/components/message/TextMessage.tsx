import React from "react";
import { ZoomIn, Copy, Check } from "lucide-react";
import { FileAttachment } from "@features/chat/types/message";
import { AIAvatar } from "../../../../components";
import { MarkdownRenderer } from "../../../../components/MarkdownRenderer";
import { FileAttachmentPreview } from "./FileAttachmentPreview";
import { useTextCopyState } from "@hook/chat/ui/useTextCopyState";
import { ThinkingPanel } from "./ThinkingPanel";

interface TextMessageProps {
    role: "user" | "assistant";
    text: string;
    reasoning?: string;
    showThinking?: boolean;
    imageUrls?: string[];
    fileAttachments?: FileAttachment[];
    onImageClick: (url: string) => void;
    isGenerating?: boolean;
}

export const TextMessage: React.FC<TextMessageProps> = ({
    role,
    text,
    reasoning,
    showThinking = false,
    imageUrls,
    fileAttachments,
    onImageClick,
    isGenerating = false,
}) => {
    const { isCopied, handleCopyText } = useTextCopyState(text);

    const displayImages = imageUrls && imageUrls.length > 0 ? imageUrls : [];
    const canShowThinking = role === "assistant" && showThinking;

    return (
        <div
            className={`flex ${role === "user" ? "flex-row-reverse" : "relative pl-12"}`}
        >
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
                                className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-zoom-in group transition-transform hover:scale-[1.02]"
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
                        {fileAttachments.map((file) => (
                            <FileAttachmentPreview
                                key={file.filename}
                                file={file}
                                role={role}
                            />
                        ))}
                    </div>
                )}

                <ThinkingPanel
                    label="思考过程"
                    reasoning={reasoning}
                    show={canShowThinking}
                    className="group flex flex-col gap-2"
                />

                {text && text.trim() && (
                    <div className="group flex flex-col gap-2">
                        <div
                            className={`text-base leading-loose p-3 overflow-y-auto min-w-0 ${
                                role === "user"
                                    ? "bg-slate-900 text-white rounded-xl rounded-tr-xs"
                                    : "bg-fill-muted border-none text-slate-700 rounded-none"
                            }`}
                        >
                            {role === "user" ? (
                                text
                            ) : (
                                <MarkdownRenderer content={text} />
                            )}
                        </div>

                        <div
                            className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                                role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <button
                                onClick={handleCopyText}
                                className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
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
                                aria-label={
                                    isCopied ? "已复制到剪贴板" : "复制文本内容"
                                }
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
                    </div>
                )}
            </div>
        </div>
    );
};


