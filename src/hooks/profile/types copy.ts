//Types For Auth Hooks
import type { Session } from "@supabase/supabase-js";

//Profile variable
export interface UserProfile {
    name: string;
    avatar: string;
}

//Full upload
export interface ProfileUploadPayload {
    name: string;
    avatar: string;
    avatarFile?: File | null;
}

export interface AvatarUploadResult {
    publicUrl: string;
    storagePath: string;
}

export interface AuthInterface {
    signIn(email: string, password: string): Promise<unknown>;
    signUp(email: string, password: string): Promise<unknown>;
    socialLogin(provider: string): Promise<unknown>;
    signOut(): Promise<void>;
    getSession(): Promise<AuthSession | null>;
    onAuthStateChange(
        callback: (session: AuthSession | null) => void,
    ): () => void;
    updateUser(userUpdateData: ProfileUploadPayload): Promise<void>;
    parseUserProfile(session: AuthSession | null): UserProfile | null;
}

export interface AvatarUploadInterface {
    uploadAvatarFn: (
        userId: string,
        file: File,
    ) => Promise<AvatarUploadResult>;
}

export type AuthMode = "signin" | "register";

export type AuthSession = Session;
