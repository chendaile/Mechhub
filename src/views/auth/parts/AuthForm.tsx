import type { FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { cn } from "../../shared/utils";
import type { AuthMode } from "../types";
import { AuthSocialButtons } from "./AuthSocialButtons";
import { AuthToggle } from "./AuthToggle";

interface AuthFormProps {
    mode: AuthMode;
    setMode: (mode: AuthMode) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    isLoading: boolean;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    onSubmit: (e: FormEvent) => void;
    onSocialLogin: (provider: "google" | "github") => void;
}

export const AuthForm = ({
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    showPassword,
    setShowPassword,
    onSubmit,
    onSocialLogin,
}: AuthFormProps) => {
    return (
        <>
            <AuthToggle mode={mode} setMode={setMode} />

            <form onSubmit={onSubmit}>
                <div>
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2 ml-1">
                        邮箱地址
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                            <Mail size={18} />
                        </div>
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@university.edu"
                            className="pl-11 pr-4"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2 ml-1 min-h-6">
                        <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider">
                            密码
                        </label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            tabIndex={mode === "signin" ? 0 : -1}
                            aria-hidden={mode !== "signin"}
                            className={cn(
                                "text-xs font-semibold text-[#0f172a] hover:underline",
                                mode === "signin" ? "visible" : "invisible pointer-events-none",
                            )}
                        >
                            忘记密码？
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                            <Lock size={18} />
                        </div>
                        <Input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="pl-11 pr-10"
                        />
                        <Button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            variant="ghost"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2 px-0 py-0 text-[#94a3b8] hover:text-[#475569]"
                        >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </Button>
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} size="md" className="w-full mt-8">
                    {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <>
                            {mode === "signin" ? "登录" : "创建账户"}
                            <ArrowRight size={18} />
                        </>
                    )}
                </Button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e2e8f0]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-[#ffffff] px-2 text-[#64748b]">或通过以下方式继续</span>
                </div>
            </div>

            <AuthSocialButtons onSocialLogin={onSocialLogin} />
        </>
    );
};
