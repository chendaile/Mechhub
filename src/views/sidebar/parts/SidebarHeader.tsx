import React from "react";
import { Plus } from "lucide-react";
import { MechHubLogo } from "../../shared/MechHubLogo";
import { Button } from "../../shared/ui/button";

interface SidebarHeaderProps {
    onLogoClick: () => void;
    onLogoIconClick: (event: React.MouseEvent) => void;
    onNewQuest?: () => void;
}

export const SidebarHeader = ({ onLogoClick, onLogoIconClick, onNewQuest }: SidebarHeaderProps) => {
    return (
        <div className="px-4 py-6 flex flex-col items-center">
            <MechHubLogo
                className="mb-8 cursor-pointer flex-wrap"
                onClick={onLogoClick}
                onIconClick={onLogoIconClick}
            />

            {onNewQuest && (
                <Button
                    onClick={onNewQuest}
                    size="sm"
                    className="w-full rounded-[1.5rem] text-[#ffffff] text-[1.125rem]"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span className="text-[#ffffff] text-[1.1875rem]">新对话</span>
                </Button>
            )}
        </div>
    );
};
