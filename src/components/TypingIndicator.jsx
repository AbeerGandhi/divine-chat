import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TypingIndicator() {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowText(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex items-center gap-3 p-2">
            <div className="flex gap-1">
                {[1, 2, 3].map((dot) => (
                    <motion.div
                        key={dot}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: dot * 0.1,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
            {showText && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-500 font-medium animate-pulse"
                >
                    Consulting ancient wisdom...
                </motion.span>
            )}
        </div>
    );
}
