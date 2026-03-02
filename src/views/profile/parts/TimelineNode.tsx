import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface TimelineNodeProps {
    x: number;
    y: number;
    title: string;
    status: "completed" | "current" | "locked";
    delay: number;
    isTop?: boolean;
}

export const TimelineNode = ({ x, y, title, status, delay, isTop }: TimelineNodeProps) => {
    return (
        <motion.div
            className="absolute flex flex-col items-center"
            style={{ left: x - 20, top: y - 20 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 200 }}
        >
            <div
                className={`w-10 h-10 rounded-[9999px] flex items-center justify-center border-[4px] z-10 shadow-sm relative ${
                    status === "completed"
                        ? "bg-white border-blue-500"
                        : status === "current"
                          ? "bg-blue-600 border-blue-200 ring-4 ring-blue-100"
                          : "bg-slate-100 border-slate-200"
                }`}
            >
                {status === "completed" && <div className="w-3 h-3 bg-blue-500 rounded-[9999px]" />}
                {status === "current" && (
                    <div className="w-3 h-3 bg-white rounded-[9999px] animate-pulse" />
                )}
                {status === "locked" && <Lock size={14} className="text-slate-300" />}
            </div>

            <motion.div
                className={`absolute w-32 text-center text-xs font-bold leading-tight ${
                    status === "locked" ? "text-slate-400" : "text-slate-800"
                }`}
                style={{ top: isTop ? -45 : 50 }}
                initial={{ opacity: 0, y: isTop ? 10 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.2 }}
            >
                {title}
            </motion.div>
        </motion.div>
    );
};
