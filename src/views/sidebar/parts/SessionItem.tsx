import React from "react";
import { Trash2, LucideIcon, Edit2, Check, X, MoreVertical } from "lucide-react";
import { Input } from "../../shared/ui/input";
import { cn } from "../../shared/utils";

interface SessionItemMenuAction {
    key: string;
    label: string;
    icon: LucideIcon;
    variant?: "default" | "danger";
    onClick: () => void;
}

interface SessionItemProps {
    label: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    isGeneratingTitle?: boolean;
    isEditing: boolean;
    editTitle: string;
    isMenuOpen: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
    menuRef: React.RefObject<HTMLDivElement>;
    onStartEdit?: () => void;
    onChangeTitle: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onToggleMenu: () => void;
    onCloseMenu: () => void;
    onDelete?: () => void;
    menuActions?: SessionItemMenuAction[];
}

export const SessionItem = ({
    label,
    icon: Icon,
    active,
    onClick,
    isGeneratingTitle = false,
    isEditing,
    editTitle,
    isMenuOpen,
    inputRef,
    menuRef,
    onStartEdit,
    onChangeTitle,
    onSave,
    onCancel,
    onToggleMenu,
    onCloseMenu,
    onDelete,
    menuActions = [],
}: SessionItemProps) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            onSave();
        } else if (e.key === "Escape") {
            onCancel();
        }
    };

    const hasMenuOptions = menuActions.length > 0 || !!onStartEdit || !!onDelete;

    return (
        <div
            onClick={onClick}
            className={cn(
                "w-full group flex items-center gap-3 px-2 py-1 rounded-[1rem] text-xs font-medium transition-colors relative cursor-pointer",
                active
                    ? "bg-[#ffffff] text-[#334155]"
                    : "text-[#64748b] hover:bg-[#ffffff] hover:text-[#334155]",
            )}
        >
            {isEditing ? (
                <div
                    className="flex-1 flex items-center gap-1.5 pr-1 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Input
                        ref={inputRef}
                        type="text"
                        inputSize="sm"
                        variant="ghost"
                        value={editTitle}
                        onChange={(e) => onChangeTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={onSave}
                        className="flex-1 min-w-0"
                    />
                    <div className="flex shrink-0 items-center gap-0.5">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSave();
                            }}
                            className="p-1 hover:bg-[#dcfce7] rounded-[0.25rem] transition-all text-[#64748b] hover:text-[#16a34a]"
                            title="保存 (Enter)"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel();
                            }}
                            className="p-1 hover:bg-[#fef2f2] rounded-[0.25rem] transition-all text-[#64748b] hover:text-[#dc2626]"
                            title="取消 (Esc)"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {isGeneratingTitle ? (
                        <div className="flex-1 flex items-center gap-2">
                            <div className="h-3 bg-[#e2e8f0] rounded-[0.25rem] animate-pulse flex-1 max-w-[7.5rem]"></div>
                            <div className="text-[0.625rem] animate-pulse">生成中...</div>
                        </div>
                    ) : (
                        <>
                            {/* Title - takes most space */}
                            <span className="block truncate flex-1 text-left">{label}</span>

                            {/* Three-dot menu button */}
                            {hasMenuOptions && (
                                <div className="relative shrink-0" ref={menuRef}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleMenu();
                                        }}
                                        className="rounded-[0.75rem] p-1.5 text-[#94a3b8] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#e2e8f0] hover:text-[#334155]"
                                        title="更多操作"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {/* Dropdown menu */}
                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-1 bg-[#ffffff] rounded-[1rem] shadow-xl border border-[#f1f5f9] py-1.5 w-32 z-50 overflow-hidden">
                                            {menuActions.map((action) => {
                                                const ActionIcon = action.icon;
                                                const actionClass =
                                                    action.variant === "danger"
                                                        ? "w-full px-3 py-2 text-left text-sm hover:bg-[#fef2f2] flex items-center gap-2.5 text-[#334155] hover:text-[#dc2626] transition-colors whitespace-nowrap leading-none"
                                                        : "w-full px-3 py-2 text-left text-sm hover:bg-[#f8fafc] flex items-center gap-2.5 text-[#334155] transition-colors whitespace-nowrap leading-none";

                                                const iconClass =
                                                    action.variant === "danger"
                                                        ? "text-[#ef4444] stroke-[1.5]"
                                                        : "text-[#3b82f6] stroke-[1.5]";

                                                return (
                                                    <button
                                                        key={action.key}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onCloseMenu();
                                                            action.onClick();
                                                        }}
                                                        className={actionClass}
                                                    >
                                                        <ActionIcon
                                                            size={15}
                                                            className={iconClass}
                                                        />
                                                        <span className="font-medium">
                                                            {action.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}

                                            {onStartEdit && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onStartEdit();
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-[#f8fafc] flex items-center gap-2.5 text-[#334155] transition-colors whitespace-nowrap leading-none"
                                                >
                                                    <Edit2
                                                        size={15}
                                                        className="text-[#3b82f6] stroke-[1.5]"
                                                    />
                                                    <span className="font-medium">重命名</span>
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete();
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-[#fef2f2] flex items-center gap-2.5 text-[#334155] hover:text-[#dc2626] transition-colors whitespace-nowrap leading-none"
                                                >
                                                    <Trash2
                                                        size={15}
                                                        className="text-[#ef4444] stroke-[1.5]"
                                                    />
                                                    <span className="font-medium">删除</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};
