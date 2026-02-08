import React from "react";
import { Plus, Settings, MessageSquare, LogOut } from "lucide-react";
import { MissionItem } from "../../view/sidebar/components/MissionItem";
import { useSidebarResizeState } from "@hook/sidebar/ui/useSidebarResizeState";
import { useSidebarActionsFlow } from "@hook/sidebar/flow/useSidebarActionsFlow";
import { SidebarProps } from "./types/sidebar";
import { MechHubLogo } from "../../components";
import { Button } from "../../components/ui/button";
import { ICON_SIZE, ICON_STROKE_WIDTH } from "../../lib/ui-constants";
import { cn } from "../../lib/utils";

export const Sidebar: React.FC<SidebarProps> = ({
    activeView,
    setActiveView,
    user = {
        name: "张同学",
        avatar: "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        role: "Lv.12 学徒",
    },
    sessions = [],
    currentSessionId,
    handleSelectSession,
    handleStartNewQuest,
    deleteChatSession,
    onRenameSession,
    handleSignOut,
    isLoading = false,
}) => {
    const { sidebarWidth, handleMouseDown } = useSidebarResizeState();
    const { onNewQuest, onSelectSession, handleDeleteSession } =
        useSidebarActionsFlow({
            setActiveView,
            handleSelectSession,
            handleStartNewQuest,
            deleteChatSession,
        });

    return (
        <div
            className="relative flex flex-col border-r border-canvas-alt bg-canvas-alt"
            style={{ width: `${sidebarWidth}px` }}
        >
            {/* Resize Handle */}
            <div
                className="absolute top-0 right-0 w-3 h-full z-50 flex "
                style={{ cursor: "ew-resize" }}
                onMouseDown={handleMouseDown}
                title="拖拽调整侧边栏宽度"
            ></div>

            {/* Header */}
            <div className="px-4 py-6 flex flex-col items-center">
                <MechHubLogo
                    className="mb-8 cursor-pointer flex-wrap"
                    onClick={() => setActiveView("home")}
                    onIconClick={(e) => {
                        e.stopPropagation();
                        setActiveView("landing");
                    }}
                />

                <Button
                    onClick={onNewQuest}
                    size="sm"
                    className="w-full rounded-xl text-on-ink [font-size:var(--font-size-sidebar-btn-icon)]"
                >
                    <Plus
                        size={ICON_SIZE.lg}
                        strokeWidth={ICON_STROKE_WIDTH.strong}
                    />
                    <span className="text-on-ink [font-size:var(--font-size-sidebar-btn-label)]">
                        新对话
                    </span>
                </Button>
            </div>

            {/* Recent Missions */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
                <h3 className="text-xs font-bold text-text-faint uppercase tracking-wider mb-4">
                    最近对话
                </h3>
                <div className="space-y-1">
                    {isLoading ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-10 bg-fill-soft rounded-lg w-full"></div>
                            <div className="h-10 bg-fill-soft rounded-lg w-full"></div>
                            <div className="h-10 bg-fill-soft rounded-lg w-full"></div>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-sm text-text-faint text-center py-4">
                            暂无历史记录
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <MissionItem
                                key={session.id}
                                label={session.title}
                                icon={MessageSquare}
                                active={
                                    currentSessionId === session.id &&
                                    activeView === "chat"
                                }
                                onClick={() => {
                                    setActiveView("chat");
                                    onSelectSession?.(session.id);
                                }}
                                onDelete={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
                                }}
                                onRename={
                                    onRenameSession
                                        ? (newTitle) =>
                                              onRenameSession(
                                                  session.id,
                                                  newTitle,
                                              )
                                        : undefined
                                }
                                isGeneratingTitle={session.isGeneratingTitle}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4">
                <button
                    onClick={() => setActiveView("profile")}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-xl p-2 text-left [font-size:var(--font-size-profile-trigger)] transition-colors",
                        activeView === "profile"
                            ? "bg-surface text-text-secondary"
                            : "text-text-secondary hover:bg-surface",
                    )}
                >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-surface bg-border-subtle shadow-sm">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-text-secondary truncate">
                            {user.name}
                        </div>
                    </div>
                    <Settings size={ICON_SIZE.md} className="text-focus-ring" />
                </button>

                {/* Sign Out Button */}
                {handleSignOut && (
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-xs font-bold text-text-faint hover:text-danger transition-colors w-full px-4 py-2 mt-2 rounded-lg hover:bg-fill-muted"
                    >
                        <LogOut size={ICON_SIZE.xs} />
                        退出登录
                    </button>
                )}
            </div>
        </div>
    );
};
