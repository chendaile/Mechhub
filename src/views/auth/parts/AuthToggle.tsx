import { motion } from "framer-motion";
import { Button } from "../../shared/ui/button";
import { cn } from "../../shared/utils";
import type { AuthMode } from "../types";

type AuthToggleProps = {
    mode: AuthMode;
    toggleSigninMode: () => void;
    toggleRegisterMode: () => void;
};

export const AuthToggle = ({ mode, toggleSigninMode, toggleRegisterMode }: AuthToggleProps) => {
    return (
        <div className="bg-[#f1f5f9] rounded-[999px] flex relative mb-8">
            <motion.div
                className="absolute top-1.5 bottom-1.5 bg-[#ffffff] rounded-[999px] shadow-sm z-0"
                layoutId="authMode"
                initial={false}
                animate={{
                    left: mode === "signin" ? "6px" : "50%",
                    width: "calc(50% - 6px)",
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
            />
            <Button
                onClick={() => toggleSigninMode()}
                variant="tab"
                size="sm"
                className={cn(
                    "flex-1 relative z-10 py-2.5 text-center transition-colors",
                    mode === "signin" ? "text-[#0f172a]" : "text-[#64748b]",
                )}
            >
                登录
            </Button>
            <Button
                onClick={() => toggleRegisterMode()}
                variant="tab"
                size="sm"
                className={cn(
                    "flex-1 relative z-10 py-2.5 text-center transition-colors",
                    mode === "register" ? "text-[#0f172a]" : "text-[#64748b]",
                )}
            >
                注册
            </Button>
        </div>
    );
};
