import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileAttachment } from "../types";
import styles from "../../shared/scrollbar.module.css";

interface FileAttachmentPreviewProps {
    file: FileAttachment;
    role: "user" | "assistant";
    isExpanded: boolean;
    onToggleExpanded: () => void;
}

export const FileAttachmentPreview = ({
    file,
    role,
    isExpanded,
    onToggleExpanded,
}: FileAttachmentPreviewProps) => {
    const MAX_CHARS_PER_LINE = 100;

    const originalLines = file.content.split("\n");
    const processedLines = originalLines.flatMap((line) => {
        if (line.length <= MAX_CHARS_PER_LINE) return [line];
        const chunks = [];
        for (let i = 0; i < line.length; i += MAX_CHARS_PER_LINE) {
            chunks.push(line.slice(i, i + MAX_CHARS_PER_LINE));
        }

        return chunks;
    });

    const isTruncated = processedLines.length > 30;
    const displayContent = isTruncated
        ? processedLines.slice(0, 30).join("\n")
        : processedLines.join("\n");

    return (
        <div
            className={`border rounded-[1rem] overflow-hidden shadow-sm ${
                role === "user" ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}
        >
            <button
                onClick={onToggleExpanded}
                className="w-full px-4 py-3 flex items-center gap-3 transition-colors"
                style={{
                    backgroundColor: role === "user" ? "#334155" : "#ffffff",
                }}
            >
                <span className="text-xl flex-shrink-0">📄</span>
                <span
                    style={{
                        color: role === "user" ? "#ffffff" : "#0f172a",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        flexGrow: 1,
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                    }}
                >
                    {file.filename || "未命名文件"}
                </span>
                {file.language && (
                    <span
                        style={{
                            fontSize: "0.75rem",
                            padding: "0.125rem 0.5rem",
                            borderRadius: "0.25rem",
                            flexShrink: 0,
                            backgroundColor: role === "user" ? "#475569" : "#e2e8f0",
                            color: role === "user" ? "#ffffff" : "#475569",
                        }}
                    >
                        {file.language.toUpperCase()}
                    </span>
                )}
                <ChevronDown
                    size={18}
                    className={`flex-shrink-0 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                    } ${role === "user" ? "text-white" : "text-slate-600"}`}
                />
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div
                            className={`max-h-96 overflow-auto ${
                                role === "user" ? "bg-slate-800" : "bg-white"
                            } ${styles.scrollbar}`}
                        >
                            <SyntaxHighlighter
                                language={file.language || "text"}
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: "1rem",
                                    backgroundColor: "#1e293b",
                                }}
                                showLineNumbers={true}
                                lineNumberStyle={{ color: "#64748b" }}
                            >
                                {displayContent}
                            </SyntaxHighlighter>
                            {isTruncated && (
                                <div
                                    className={`px-4 py-2 text-center text-xs ${
                                        role === "user"
                                            ? "bg-slate-700 text-slate-300"
                                            : "bg-slate-50 text-slate-500"
                                    }`}
                                >
                                    ... 显示了前 30 行（已自动换行），共 {processedLines.length} 行
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
