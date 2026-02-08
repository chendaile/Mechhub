import React, { useState } from "react";
import { MarkdownRenderer } from "../../../../components/MarkdownRenderer";

interface ThinkingPanelProps {
    label: string;
    buttonLabel?: string;
    emptyLabel?: string;
    reasoning?: string;
    show?: boolean;
    defaultOpen?: boolean;
    className?: string;
}

export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({
    label,
    buttonLabel = "查看思考过程",
    emptyLabel = "暂无思考过程",
    reasoning,
    show = true,
    defaultOpen = false,
    className,
}) => {
    const [open, setOpen] = useState(defaultOpen);
    const hasReasoning = !!reasoning && reasoning.trim().length > 0;

    if (!show) return null;

    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="self-start rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm hover:border-slate-300 hover:text-slate-800 transition-colors"
            >
                {open ? "隐藏思考过程" : buttonLabel}
            </button>

            {open && (
                <div className="mt-2 text-base leading-loose p-3 overflow-y-auto min-w-0 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        {label}
                    </div>
                    {hasReasoning ? (
                        <MarkdownRenderer content={reasoning || ""} />
                    ) : (
                        <div className="text-sm text-slate-500">
                            {emptyLabel}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
