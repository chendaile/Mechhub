import React from "react";
import { Settings } from "lucide-react";

interface MechHubLogoProps {
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    onIconClick?: (e: React.MouseEvent) => void;
}

export const MechHubLogo = ({ className, onClick, onIconClick }: MechHubLogoProps) => {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`} onClick={onClick}>
            <div
                className="bg-black text-white rounded-[0.75rem] p-2 cursor-pointer"
                onClick={onIconClick}
            >
                <Settings
                    className="animate-[spin_10s_linear_infinite]"
                    size={24}
                    strokeWidth={2.5}
                />
            </div>
            <span className="text-[32px] font-bold tracking-tight font-['Courier_New']">
                MechHub
            </span>
        </div>
    );
};
