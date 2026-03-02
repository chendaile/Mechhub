import { motion } from "framer-motion";

export const AppLoadingView = () => {
    return (
        <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
            <motion.div className="relative" style={{ width: 56, height: 56 }}>
                {/* 底层轨道 */}
                <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                    <circle cx="20" cy="20" r="17" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                </svg>

                {/* 旋转弧线 */}
                <motion.svg
                    viewBox="0 0 40 40"
                    className="absolute inset-0 w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <circle
                        cx="20"
                        cy="20"
                        r="17"
                        fill="none"
                        stroke="#1E293B"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeDasharray="28 79"
                    />
                </motion.svg>
            </motion.div>
        </div>
    );
};
