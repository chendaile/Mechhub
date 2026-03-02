import type { ReactNode, RefObject } from "react";

export interface ClassThreadMessageItem {
    id: string;
    senderUserId?: string | null;
    senderName?: string | null;
    senderAvatar?: string | null;
    role: "user" | "assistant" | "system";
    content: Record<string, unknown>;
    createdAt: string;
}

export type ClassThreadContentRenderer = (content: Record<string, unknown>) => string;

export interface ClassThreadChatViewProps {
    className: string;
    threadTitle: string;
    messages: ClassThreadMessageItem[];
    currentUserId: string;
    isSending: boolean;
    isLoadingMessages?: boolean;
    renderMessageContent: ClassThreadContentRenderer;
    inputBar: ReactNode;
    onCopySharedChatToNewSession?: (content: Record<string, unknown>) => void;
    scrollAnchorRef?: RefObject<HTMLDivElement | null>;
}
