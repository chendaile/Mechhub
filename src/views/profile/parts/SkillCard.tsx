import React from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";

interface SkillCardProps {
    icon: React.ReactNode;
    title: string;
    status: "earned" | "locked";
    delay: number;
}

export const SkillCard = ({ icon, title, status, delay }: SkillCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className={`group relative p-6 rounded-[2rem] border flex items-center gap-6 cursor-pointer overflow-hidden ${
            status === "earned"
                ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg"
                : "bg-slate-50 border-slate-100 opacity-70 grayscale"
        }`}
    >
        <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-[9999px] bg-slate-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div
            className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-[2rem] text-3xl transition-colors ${
                status === "earned"
                    ? "bg-slate-50 text-slate-800 group-hover:bg-blue-50 group-hover:text-blue-600"
                    : "bg-slate-100 text-slate-400"
            }`}
        >
            {icon}
        </div>

        <div className="flex-1 relative z-10">
            <h4 className="text-lg font-bold text-slate-800 mb-1">{title}</h4>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                {status === "earned" ? (
                    <>
                        <Check size={14} className="text-green-500" strokeWidth={3} />
                        <span className="text-slate-500">已获得</span>
                    </>
                ) : (
                    <>
                        <Lock size={14} />
                        未解锁
                    </>
                )}
            </div>
        </div>

        {status === "locked" && (
            <div className="absolute top-4 right-4">
                <Lock size={16} className="text-slate-300" />
            </div>
        )}
    </motion.div>
);
