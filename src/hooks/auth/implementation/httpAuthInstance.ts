import type { AuthInterface, Session } from "../types";
import { httpClient } from "../../shared/httpClient";

export const HttpAuthInstance: AuthInterface = {
    async signIn(email: string, password: string): Promise<Session> {
        const result = await httpClient.post<{ session: Session }>("/auth/sign-in", {
            email,
            password,
        });
        return result.session;
    },
    async signUp(email: string, password: string): Promise<Session> {
        const result = await httpClient.post<{ session: Session }>("/auth/sign-up", {
            email,
            password,
        });
        return result.session;
    },
    async signOut(): Promise<void> {
        await httpClient.post("/auth/sign-out");
    },
};
