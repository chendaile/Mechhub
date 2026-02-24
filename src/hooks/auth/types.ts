export interface Session {
    refreshToken: string;
    refreshExpiresAt: number;
    accessToken: string;
    accessTokenExpiresAt: number;
    userId: string;
    email: string;
    tokenType: "Bearer";
}

export interface AuthInterface {
    signIn(email: string, password: string): Promise<Session>;
    signUp(email: string, password: string): Promise<Session>;
    signOut(): Promise<void>;
}

export type AuthMode = "signin" | "register";
