import { useSyncExternalStore } from "react";

let showAuthStore = false;

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

const getSnapshot = () => showAuthStore;

const setShowAuth = (value: boolean) => {
    if (showAuthStore === value) {
        return;
    }

    showAuthStore = value;
    emitChange();
};

export const InAuthPageOrNotUIState = () => {
    const showAuth = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    return {
        showAuth,
        setShowAuth,
    };
};
