import React from "react";

interface SidebarResizeHandleProps {
    onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const SidebarResizeHandle = ({ onMouseDown }: SidebarResizeHandleProps) => {
    return (
        <div
            className="absolute top-0 right-0 w-3 h-full z-50 flex"
            style={{ cursor: "ew-resize" }}
            onMouseDown={onMouseDown}
            title="拖拽调整侧边栏宽度"
        />
    );
};
