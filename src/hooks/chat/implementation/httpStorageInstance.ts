import type { StorageInterface, UploadResult } from "../interface/storageInterface";
import { httpClient } from "../../shared/httpClient";

export const createHttpStoragePort = (): StorageInterface => {
    return {
        async uploadImage(file: File): Promise<UploadResult> {
            const formData = new FormData();
            formData.append("file", file);
            return httpClient.postForm<UploadResult>("/chat/attachments/images", formData);
        },
    };
};
