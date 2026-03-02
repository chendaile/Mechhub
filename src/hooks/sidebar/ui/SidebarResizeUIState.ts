import { useState, useEffect } from "react";
import { persistSidebarWidth, readSidebarWidth } from "../interface/sidebarInterface";
import { SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from "../constants";

const SIDEBAR_WIDTH_CONFIG = {
    min: SIDEBAR_MIN_WIDTH,
    max: SIDEBAR_MAX_WIDTH,
    fallback: SIDEBAR_DEFAULT_WIDTH,
} as const;

export const SidebarResizeUIState = () => {
    const [sidebarWidth, setSidebarWidth] = useState(() => readSidebarWidth(SIDEBAR_WIDTH_CONFIG));
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const newWidth = e.clientX;
            if (newWidth >= SIDEBAR_MIN_WIDTH && newWidth <= SIDEBAR_MAX_WIDTH) {
                setSidebarWidth(newWidth);
                persistSidebarWidth(newWidth, SIDEBAR_WIDTH_CONFIG);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "ew-resize";
            document.body.style.userSelect = "none";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isResizing]);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const state = {
        sidebarWidth,
    };

    const actions = {
        handleMouseDown,
    };

    return {
        state,
        actions,
        sidebarWidth: state.sidebarWidth,
        handleMouseDown: actions.handleMouseDown,
    };
};
