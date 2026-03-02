import { GroupTextMessageView } from "@views/chat/message";
import styles from "@views/shared/scrollbar.module.css";
import type { ClassThreadChatViewProps } from "./types";
import { Button } from "@views/shared/ui/button";
import { LoadingList } from "@views/shared/LoadingList";

const formatSharedSummary = (content: Record<string, unknown>) => {
    const sourceTitle =
        typeof content.sourceTitle === "string" ? content.sourceTitle : "未命名会话";

    const messageCount = Array.isArray(content.sharedMessages) ? content.sharedMessages.length : 0;

    return `分享会话：${sourceTitle} · ${messageCount} 条消息`;
};

const PendingShareCard = ({ alignRight = false }: { alignRight?: boolean }) => (
    <div className={`py-3 text-sm text-slate-700 ${alignRight ? "text-right" : "text-left"}`}>
        <p className="font-semibold text-slate-900">会话分享</p>
        <p className="mt-1 animate-pulse text-xs text-slate-500">正在分享会话...</p>
    </div>
);

const SharedChatMessageCard = ({
    content,
    onCopy,
    alignRight = false,
}: {
    content: Record<string, unknown>;
    onCopy?: (content: Record<string, unknown>) => void;
    alignRight?: boolean;
}) => (
    <div className={`py-3 text-sm text-slate-700 ${alignRight ? "text-right" : "text-left"}`}>
        <p className="font-semibold text-slate-900">会话分享</p>
        <p className="mt-1 text-xs text-slate-600">{formatSharedSummary(content)}</p>
        {onCopy && (
            <div className={`mt-3 flex ${alignRight ? "justify-end" : "justify-start"}`}>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onCopy(content)}
                    className="inline-flex items-center px-3 py-1.5"
                >
                    复制到我的新会话
                </Button>
            </div>
        )}
    </div>
);

export const ClassThreadChatView = ({
    className,
    threadTitle,
    messages,
    currentUserId,
    renderMessageContent,
    inputBar,
    onCopySharedChatToNewSession,
    scrollAnchorRef,
    isLoadingMessages = false,
}: ClassThreadChatViewProps) => {
    return (
        <div className="absolute inset-0 z-0 flex flex-col overflow-y-hidden">
            <header className="px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    班级群聊
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{className}</h2>
                <p className="text-sm text-slate-600">{threadTitle}</p>
            </header>

            <div className={`flex-1 overflow-y-auto bg-slate-50 px-6 py-5 ${styles.scrollbar}`}>
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                    {isLoadingMessages ? (
                        <LoadingList className="px-1" />
                    ) : messages.length === 0 ? (
                        <div className="rounded-2xl px-4 py-6 text-center text-sm text-slate-500">
                            暂时还没有消息，开始班级讨论吧。
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwnMessage = message.senderUserId === currentUserId;

                            const isSharedChatMessage =
                                message.role === "system" && message.content.kind === "shared_chat";

                            const isPendingShareMessage =
                                message.role === "system" && message.content.kind === "share";

                            const isAiTyping = message.content.kind === "ai_typing";

                            if (isSharedChatMessage) {
                                return (
                                    <GroupTextMessageView
                                        key={message.id}
                                        content={
                                            <SharedChatMessageCard
                                                content={message.content}
                                                onCopy={onCopySharedChatToNewSession}
                                                alignRight={isOwnMessage}
                                            />
                                        }
                                        senderName={message.senderName ?? "班级成员"}
                                        senderAvatar={message.senderAvatar}
                                        createdAt={message.createdAt}
                                        isOwnMessage={isOwnMessage}
                                        role={message.role}
                                    />
                                );
                            }

                            if (isPendingShareMessage) {
                                return (
                                    <GroupTextMessageView
                                        key={message.id}
                                        content={<PendingShareCard alignRight={isOwnMessage} />}
                                        senderName={message.senderName ?? "班级成员"}
                                        senderAvatar={message.senderAvatar}
                                        createdAt={message.createdAt}
                                        isOwnMessage={isOwnMessage}
                                        role={message.role}
                                    />
                                );
                            }

                            return (
                                <GroupTextMessageView
                                    key={message.id}
                                    content={
                                        isAiTyping ? (
                                            <span className="animate-pulse text-slate-500">
                                                AI 正在回复...
                                            </span>
                                        ) : (
                                            renderMessageContent(message.content)
                                        )
                                    }
                                    senderName={message.senderName ?? "班级成员"}
                                    senderAvatar={message.senderAvatar}
                                    createdAt={message.createdAt}
                                    isOwnMessage={isOwnMessage}
                                    role={message.role}
                                />
                            );
                        })
                    )}
                    <div ref={scrollAnchorRef} />
                </div>
            </div>

            <div className="z-20 w-full bg-[#f8fafc] p-4">
                {inputBar}
                <div className="mt-3 text-center font-['courier_new'] text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    AI can make mistakes.
                </div>
            </div>
        </div>
    );
};
