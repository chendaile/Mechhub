import { useSyncExternalStore } from "react";
import { authInstance } from "./interface/authInterface";
import type { Session } from "./types";

const AUTH_SESSION_STORAGE_KEY = "Auth.Session";

const readStoredSession = (): Session | null => {
    if (typeof window === "undefined") {
        return null;
    }

    const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as Session;
    } catch {
        window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);

        return null;
    }
};

let currentSessionStore: Session | null = readStoredSession();

const sessionListeners = new Set<() => void>();

const emitSessionChange = () => {
    sessionListeners.forEach((listener) => listener());
};

const subscribeSession = (listener: () => void) => {
    sessionListeners.add(listener);

    if (typeof window !== "undefined") {
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== AUTH_SESSION_STORAGE_KEY) {
                return;
            }

            currentSessionStore = readStoredSession();
            emitSessionChange();
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            sessionListeners.delete(listener);
            window.removeEventListener("storage", handleStorage);
        };
    }

    return () => {
        sessionListeners.delete(listener);
    };
};

export const getSession = () => currentSessionStore;

export const setSession = (session: Session | null) => {
    currentSessionStore = session;

    if (typeof window !== "undefined") {
        if (session) {
            window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
        } else {
            window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        }
    }

    emitSessionChange();
};

export const clearSession = () => {
    setSession(null);
};

export const useSessionQuery = () => {
    const data = useSyncExternalStore(subscribeSession, getSession, () => null);

    return {
        data,
        isLoading: false,
    };
};

export { authInstance };
