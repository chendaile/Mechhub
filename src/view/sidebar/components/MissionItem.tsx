import React, { useState, useRef, useEffect } from "react";
import {
    Trash2,
    LucideIcon,
    Edit2,
    Check,
    X,
    MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { ICON_SIZE } from "../../../lib/ui-constants";
import { cn } from "../../../lib/utils";

interface MissionItemProps {
    label: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    onDelete?: (e: React.MouseEvent) => void;
    onRename?: (newTitle: string) => Promise<boolean>;
    isGeneratingTitle?: boolean;
}

export const MissionItem: React.FC<MissionItemProps> = ({
    label,
    icon: Icon,
    active,
    onClick,
    onDelete,
    onRename,
    isGeneratingTitle = false,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(label);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isMenuOpen]);

    const handleSaveRename = async () => {
        if (!onRename || editTitle.trim() === "" || editTitle === label) {
            setIsEditing(false);
            setEditTitle(label);
            return;
        }

        const success = await onRename(editTitle.trim());
        if (success) {
            setIsEditing(false);
            toast.success("重命名成功");
        } else {
            setEditTitle(label);
            setIsEditing(false);
        }
    };

    const handleCancelRename = () => {
        setIsEditing(false);
        setEditTitle(label);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSaveRename();
        } else if (e.key === "Escape") {
            handleCancelRename();
        }
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors relative cursor-pointer",
                active
                    ? "bg-surface text-text-secondary"
                    : "text-text-subtle hover:bg-surface hover:text-text-secondary",
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
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveRename}
                        className="flex-1 min-w-0"
                    />
                    <div className="flex shrink-0 items-center gap-0.5">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSaveRename();
                            }}
                            className="p-1 hover:bg-success-bg rounded transition-all text-text-subtle hover:text-success"
                            title="保存 (Enter)"
                        >
                            <Check size={ICON_SIZE.xs} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelRename();
                            }}
                            className="p-1 hover:bg-danger-bg rounded transition-all text-text-subtle hover:text-danger-hover"
                            title="取消 (Esc)"
                        >
                            <X size={ICON_SIZE.xs} />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {isGeneratingTitle ? (
                        <div className="flex-1 flex items-center gap-2">
                            <div className="h-3 bg-border-subtle rounded animate-pulse flex-1 max-w-(--size-mission-skeleton-max-w)"></div>
                            <div className="text-(--font-size-meta) animate-pulse">
                                生成中...
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Title - takes most space */}
                            <span className="block truncate flex-1 text-left">
                                {label}
                            </span>

                            {/* Three-dot menu button */}
                            <div className="relative shrink-0" ref={menuRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className="rounded-md p-1.5 text-text-faint opacity-0 transition-all group-hover:opacity-100 hover:bg-border-subtle hover:text-text-secondary"
                                    title="更多操作"
                                >
                                    <MoreVertical size={ICON_SIZE.md} />
                                </button>

                                {/* Dropdown menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-1 bg-surface rounded-lg shadow-xl border border-border-soft py-1.5 w-32 z-50 overflow-hidden">
                                        {onRename && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsMenuOpen(false);
                                                    setIsEditing(true);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-fill-muted flex items-center gap-2.5 text-text-secondary transition-colors whitespace-nowrap leading-none"
                                            >
                                                <Edit2
                                                    size={ICON_SIZE.sm}
                                                    className="text-info stroke-[1.5]"
                                                />
                                                <span className="font-medium">
                                                    重命名
                                                </span>
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsMenuOpen(false);
                                                    onDelete(e);
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-danger-bg flex items-center gap-2.5 text-text-secondary hover:text-danger-hover transition-colors whitespace-nowrap leading-none"
                                            >
                                                <Trash2
                                                    size={ICON_SIZE.sm}
                                                    className="text-danger stroke-[1.5]"
                                                />
                                                <span className="font-medium">
                                                    删除
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};
