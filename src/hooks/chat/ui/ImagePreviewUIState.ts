import { useState } from "react";

export const ImagePreviewUIState = () => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const openPreview = (url: string) => setPreviewImage(url);
    const closePreview = () => setPreviewImage(null);

    return {
        previewImage,
        openPreview,
        closePreview,
    };
};
