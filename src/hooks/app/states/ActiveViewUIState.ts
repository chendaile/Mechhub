import { useSyncExternalStore } from "react";
import type { ActiveView } from "../types/view";

let activeViewStore: ActiveView = "home";

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

const getActiveView = () => activeViewStore;

const setActiveView = (view: ActiveView) => {
    if (activeViewStore === view) {
        return;
    }

    activeViewStore = view;
    emitChange();
};

export const ActiveViewUIState = (_initialView: ActiveView = "home") => {
    const activeView = useSyncExternalStore(subscribe, getActiveView, getActiveView);

    return {
        state: {
            activeView,
        },
        actions: {
            setActiveView,
        },
    };
};
