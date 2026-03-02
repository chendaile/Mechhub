import type { ChatSession as HookChatSession, Message as HookMessage } from "@hooks";
import type { ChatSession as ViewChatSession, Message as ViewMessage } from "@views/chat/types";

export const mapMessage = (message: HookMessage): ViewMessage => ({
    ...message,
});

export const mapChatSession = (session: HookChatSession): ViewChatSession => ({
    ...session,
    messages: session.messages ? session.messages.map(mapMessage) : undefined,
});
