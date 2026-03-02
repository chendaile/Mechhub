import { Fragment, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ActiveView } from "../../shared/types";
import type { ChatSession } from "../../chat/types";
import type { SidebarClassGroup, SidebarClassThread } from "../types";
import styles from "../../shared/scrollbar.module.css";
import { LoadingList } from "../../shared/LoadingList";

interface SidebarSessionsProps {
    sessions: ChatSession[];
    classGroups: SidebarClassGroup[];
    isClassAdmin?: boolean;
    activeView: ActiveView;
    currentSessionId: string | null;
    activeClassThreadId?: string;
    isLoading: boolean;
    onCreateClassThread?: (classId: string) => void;
    creatingClassThreadId?: string | null;
    onSelectClassThread?: (thread: SidebarClassThread) => void;
    onRenameClassThread?: (classId: string, threadId: string, title: string) => Promise<boolean>;
    onDeleteClassThread?: (classId: string, threadId: string) => Promise<boolean>;
    openGroupIds: Set<string>;
    onToggleGroup: (classId: string) => void;
    renderSession: (session: ChatSession, active: boolean) => ReactNode;
    renderClassThread?: (
        thread: SidebarClassThread,
        active: boolean,
        canManage: boolean,
    ) => ReactNode;
}

export const SidebarSessions = ({
    sessions,
    classGroups,
    isClassAdmin = false,
    activeView,
    currentSessionId,
    activeClassThreadId,
    isLoading,
    onSelectClassThread,
    openGroupIds,
    onToggleGroup,
    renderSession,
    renderClassThread,
}: SidebarSessionsProps) => {
    return (
        <div className={`flex-1 overflow-y-auto px-6 py-2 ${styles.scrollbar}`}>
            <h3 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-4">
                最近对话
            </h3>
            <div className="space-y-1">
                {isLoading ? (
                    <LoadingList />
                ) : sessions.length === 0 ? (
                    <div className="text-sm text-[#94a3b8] text-center py-4">暂无历史记录</div>
                ) : (
                    sessions.map((session) => {
                        const isActive = currentSessionId === session.id && activeView === "chat";

                        return (
                            <Fragment key={session.id}>{renderSession(session, isActive)}</Fragment>
                        );
                    })
                )}
            </div>

            <h3 className="mt-6 mb-3 text-xs font-bold text-[#94a3b8] uppercase tracking-wider">
                班级会话
            </h3>
            <div className="space-y-2 pb-2">
                {classGroups.length === 0 ? (
                    <div className=" px-3 py-3 text-xs text-slate-500">
                        还没有班级会话，先去加入班级。
                    </div>
                ) : (
                    classGroups.map((group) => {
                        const isOpen = openGroupIds.has(group.classId);
                        const canManageGroupThreads = isClassAdmin || group.role === "teacher";

                        return (
                            <div key={group.classId} className="rounded-[1rem] p-2">
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => onToggleGroup(group.classId)}
                                        className="flex min-w-0 flex-1 items-center rounded-xl px-2 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                    >
                                        {isOpen ? (
                                            <ChevronDown size={14} />
                                        ) : (
                                            <ChevronRight size={14} />
                                        )}
                                        <span className="truncate">{group.className}</span>
                                    </button>
                                </div>

                                {isOpen && (
                                    <div className="ml-4 grid">
                                        {group.threads.map((thread) => {
                                            const isActive =
                                                activeView === "chat" &&
                                                activeClassThreadId === thread.id;

                                            if (renderClassThread) {
                                                return (
                                                    <Fragment key={thread.id}>
                                                        {renderClassThread(
                                                            thread,
                                                            isActive,
                                                            canManageGroupThreads,
                                                        )}
                                                    </Fragment>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={thread.id}
                                                    type="button"
                                                    onClick={() => onSelectClassThread?.(thread)}
                                                    className={`rounded-[1rem] px-2 py-2 text-left text-xs transition ${
                                                        isActive
                                                            ? "bg-[#ffffff] text-[#334155]"
                                                            : "text-[#64748b] hover:bg-[#ffffff] hover:text-[#334155]"
                                                    }`}
                                                >
                                                    <p className="truncate font-medium">
                                                        {thread.title}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                        {group.threads.length === 0 && (
                                            <p className="px-2 py-1 text-[11px] text-slate-500">
                                                暂无会话
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
