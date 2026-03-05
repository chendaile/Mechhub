import type { ProfileInterface, ProfileUploadPayload, UserProfile } from "../types";
import { httpClient } from "../../shared/httpClient";

export const HttpProfileInstance: ProfileInterface = {
    async uploadProfile(profileUploadPayload: ProfileUploadPayload): Promise<void> {
        await httpClient.put("/profile", {
            name: profileUploadPayload.name,
            avatarUrl: profileUploadPayload.avatarUrl,
        });
    },
    async downloadProfile(): Promise<UserProfile | null> {
        return httpClient.get<UserProfile | null>("/profile");
    },
    async uploadAvatarUrl(file: File): Promise<string> {
        const formData = new FormData();
        formData.append("file", file);
        const result = await httpClient.postForm<{ avatarUrl: string }>("/profile/avatar", formData);
        return result.avatarUrl;
    },
};
