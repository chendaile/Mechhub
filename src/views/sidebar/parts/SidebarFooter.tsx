import { ChevronDown, ChevronRight } from "lucide-react";
import type { UserProfile } from "../../shared/types";
import type { SidebarAssignmentAction, SidebarAssignmentActionViewKey } from "../types";
import { SidebarSignOut } from "./SidebarSignOut";
import { SidebarUserButton } from "./SidebarUserButton";

interface SidebarFooterProps {
    user: UserProfile;
    isProfileActive: boolean;
    isClassHubActive: boolean;
    activeAssignmentKey: SidebarAssignmentActionViewKey | null;
    onOpenProfile?: () => void;
    onOpenClassHub?: () => void;
    assignmentActions: SidebarAssignmentAction[];
    assignmentsTitle: string;
    isAssignmentsOpen: boolean;
    isAssignmentsActive: boolean;
    onToggleAssignmentsOpen: () => void;
    onSignOut?: () => void;
}

export const SidebarFooter = ({
    user,
    isProfileActive,
    isClassHubActive,
    activeAssignmentKey,
    onOpenProfile,
    onOpenClassHub,
    assignmentActions,
    assignmentsTitle,
    isAssignmentsOpen,
    isAssignmentsActive,
    onToggleAssignmentsOpen,
    onSignOut,
}: SidebarFooterProps) => {
    return (
        <div className="p-4">
            {onOpenClassHub && (
                <button
                    type="button"
                    onClick={onOpenClassHub}
                    className={`mb-1 w-full rounded-[1rem] px-3 py-2 text-center text-xs font-semibold transition ${
                        isClassHubActive
                            ? "bg-[#ffffff] text-[#334155]"
                            : "text-[#64748b] hover:bg-[#ffffff] hover:text-[#334155]"
                    }`}
                >
                    我的班级
                </button>
            )}

            {assignmentActions.length > 0 && (
                <div>
                    <button
                        type="button"
                        onClick={onToggleAssignmentsOpen}
                        className={`mb-3 flex w-full items-center justify-center gap-1 rounded-[1rem] px-3 py-2 text-xs font-semibold transition ${
                            isAssignmentsActive ? "bg-[#ffffff] text-[#334155]" : "text-[#64748b]"
                        }`}
                    >
                        {isAssignmentsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <span>{assignmentsTitle}</span>
                    </button>

                    {isAssignmentsOpen && (
                        <div className="m-2 grid grid-cols-2 gap-2">
                            {assignmentActions.map((action) => (
                                <button
                                    key={action.key}
                                    type="button"
                                    onClick={action.onClick}
                                    className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${
                                        activeAssignmentKey === action.key
                                            ? "bg-[#ffffff] text-[#334155]"
                                            : "text-[#64748b] hover:bg-[#ffffff] hover:text-[#334155]"
                                    }`}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {onOpenProfile && (
                <SidebarUserButton
                    user={user}
                    isActive={isProfileActive}
                    onClick={onOpenProfile}
                />
            )}

            {onSignOut && <SidebarSignOut onSignOut={onSignOut} />}
        </div>
    );
};
