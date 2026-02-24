//Profile variable
export interface UserProfile {
    name: string | null;
    avatarUrl: string | null;
}

//Full upload
export interface ProfileUploadPayload {
    name: string | null;
    avatarUrl: string | null;
    avatarFile: File | null;
}

export interface ProfileInterface {
    uploadProfile(
        profileUploadPayload: ProfileUploadPayload,
    ): Promise<void>;
    downloadProfile(): Promise<UserProfile | null>;
    uploadAvatarUrl(file: File): Promise<string>;
}
