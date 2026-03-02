import { Settings } from "lucide-react";
import { cn } from "../../shared/utils";
import type { UserProfile, ActiveView } from "../../shared/types";

interface SidebarUserButtonProps {
    user: UserProfile;
    activeView: ActiveView;
    onClick: () => void;
}

export const SidebarUserButton = ({ user, activeView, onClick }: SidebarUserButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-[1.5rem] p-2 text-left text-[1.25rem] transition-colors",
                activeView === "profile"
                    ? "bg-[#ffffff] text-[#334155]"
                    : "text-[#334155] hover:bg-[#ffffff]",
            )}
        >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[1rem] border-2  shadow-sm">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#334155] truncate">{user.name}</div>
            </div>
        </button>
    );
};
