import type { SidebarWidthConfig } from "../types";

const SIDEBAR_WIDTH_KEY = "Sidebar.Width";

const clamp = (value: number, min: number, max: number) => {
    if (Number.isNaN(value)) {
        return min;
    }
    return Math.max(min, Math.min(max, value));
};

export const readSidebarWidth = (config: SidebarWidthConfig) => {
    if (typeof window === "undefined") {
        return config.fallback;
    }
    const raw = window.localStorage.getItem(SIDEBAR_WIDTH_KEY);
    if (!raw) {
        return config.fallback;
    }
    const parsed = Number(raw);
    return clamp(parsed, config.min, config.max);
};

export const persistSidebarWidth = (width: number, config: SidebarWidthConfig) => {
    if (typeof window === "undefined") {
        return;
    }
    const nextWidth = clamp(width, config.min, config.max);
    window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(nextWidth));
};
