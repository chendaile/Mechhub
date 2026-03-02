//Supabase Implementations
import { supabase } from "../../shared/supabase";
import type { Session, AuthInterface } from "../types";

//将 Supabase Session 映射到应用层 Session 类型
const mapToSession = (supabaseSession: {
    refresh_token: string;
    expires_at?: number;
    access_token: string;
    user: { id: string };
}): Session => ({
    refreshToken: supabaseSession.refresh_token,
    refreshExpiresAt: supabaseSession.expires_at ?? 0,
    accessToken: supabaseSession.access_token,
    accessTokenExpiresAt: supabaseSession.expires_at ?? 0,
    userId: supabaseSession.user.id,
    tokenType: "Bearer",
});

export const SupabaseAuthInstance: AuthInterface = {
    async signIn(email: string, password: string): Promise<Session> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        if (!data.session) throw new Error("登录失败：无法获取会话");

        return mapToSession(data.session);
    },

    async signUp(email: string, password: string): Promise<Session> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        if (!data.session) throw new Error("注册成功，请检查邮箱完成验证");

        return mapToSession(data.session);
    },

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },
};
