import { motion } from "framer-motion";

interface TypewriterTextProps {
    text: string;
    delay?: number;
}

export const TypewriterText = ({ text, delay = 0 }: TypewriterTextProps) => {
    const letters = text.split("");

    return (
        <span>
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.1,
                        delay: delay + i * 0.05,
                        ease: "easeOut",
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </span>
    );
};
