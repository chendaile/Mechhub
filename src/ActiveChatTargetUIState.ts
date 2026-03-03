import { useSyncExternalStore } from "react";
import type { ActiveChatTarget } from "./appShellModel";

interface SetClassChatTargetPayload {
    classId: string;
    className: string;
    threadId: string;
    threadTitle: string;
    currentUserId: string;
}

let activeChatTargetStore: ActiveChatTarget = {
    type: "private",
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

const emitChange = () => {
    listeners.forEach((listener) => listener());
};

const getActiveChatTarget = () => activeChatTargetStore;

export const ActiveChatTargetUIState = () => {
    const activeChatTarget = useSyncExternalStore(
        subscribe,
        getActiveChatTarget,
        getActiveChatTarget,
    );

    const setActiveChatTarget = (nextTarget: ActiveChatTarget) => {
        activeChatTargetStore = nextTarget;
        emitChange();
    };

    const setPrivateChatTarget = () => {
        setActiveChatTarget({ type: "private" });
    };

    const setClassChatTarget = ({
        classId,
        className,
        threadId,
        threadTitle,
        currentUserId,
    }: SetClassChatTargetPayload) => {
        setActiveChatTarget({
            type: "class",
            classId,
            className,
            threadId,
            threadTitle,
            currentUserId,
        });
    };

    const classChatTarget = activeChatTarget.type === "class" ? activeChatTarget : undefined;

    const activeClassThreadId =
        activeChatTarget.type === "class" ? activeChatTarget.threadId : undefined;

    return {
        state: {
            activeChatTarget,
            classChatTarget,
            activeClassThreadId,
        },
        actions: {
            setActiveChatTarget,
            setPrivateChatTarget,
            setClassChatTarget,
        },
        activeChatTarget,
        classChatTarget,
        activeClassThreadId,
        setActiveChatTarget,
        setPrivateChatTarget,
        setClassChatTarget,
    };
};
