import { motion } from "framer-motion";
import { AIAvatar } from "../../shared/AIAvatar";

interface HomeGreetingProps {
    userName: string;
}

export const HomeGreeting = ({ userName }: HomeGreetingProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
        >
            <AIAvatar isThinking={true} />
            <span className="text-2xl font-semibold text-slate-900">Hi, {userName}</span>
        </motion.div>
    );
};
