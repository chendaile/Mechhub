import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImagePreviewModalProps {
    previewImage: string | null;
    onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    previewImage,
    onClose,
}) => (
    <AnimatePresence>
        {previewImage && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                onClick={onClose}
            >
                {/* Close button fixed to top-right of screen */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50 rounded-full hover:bg-white/10"
                >
                    <X size={32} />
                </button>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-full max-h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={previewImage}
                        alt="Full preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    />
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
