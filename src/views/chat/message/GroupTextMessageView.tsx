import type { ReactNode } from "react";
import { MarkdownRenderer } from "../../shared/MarkdownRenderer";

interface GroupTextMessageViewProps {
    content: ReactNode;
    senderName: string;
    senderAvatar?: string | null;
    createdAt: string;
    isOwnMessage: boolean;
    role: "user" | "assistant" | "system";
}

const getInitial = (value: string) => {
    const trimmed = value.trim();

    return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
};

export const GroupTextMessageView = ({
    content,
    senderName,
    senderAvatar,
    createdAt,
    isOwnMessage,
    role,
}: GroupTextMessageViewProps) => {
    const renderedContent =
        typeof content === "string" ? <MarkdownRenderer content={content} /> : content;

    return (
        <div className={`flex w-full gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
            <div className="h-9 w-9 shrink-0 overflow-hidden">
                {senderAvatar ? (
                    <img
                        src={senderAvatar}
                        alt={senderName}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-700">
                        {getInitial(senderName)}
                    </div>
                )}
            </div>
            <div
                className={`flex max-w-[80%] flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
            >
                <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">
                        {isOwnMessage ? "You" : senderName}
                    </span>
                    <span>{formatDateTime(createdAt)}</span>
                </div>
                <div className={`px-3 py-2 text-sm leading-6 `}>{renderedContent}</div>
            </div>
        </div>
    );
};
