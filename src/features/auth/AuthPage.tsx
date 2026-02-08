import React from "react";
import { motion } from "motion/react";
import {
    Mail,
    Lock,
    GraduationCap,
    Chrome,
    Loader2,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";
import { useAuthPageState } from "@hook/auth/ui/useAuthPageState";
import { MechHubLogo } from "../../components";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ICON_SIZE } from "../../lib/ui-constants";
import { cn } from "../../lib/utils";

interface AuthPageProps {
    onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const {
        mode,
        setMode,
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        showPassword,
        setShowPassword,
        handleSubmit,
        handleSocialLogin,
        isVerificationPending,
        setIsVerificationPending,
    } = useAuthPageState(onLoginSuccess);
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-(--color-canvas) p-(--space-4)">
            <Card
                radius="3xl"
                shadow="xl"
                className="w-full max-w-6xl h-(--size-auth-card-h) flex overflow-hidden"
            >
                {/* Left Side - Visual/Decor */}
                <div className="hidden md:flex flex-1 bg-(--color-fill-muted) relative items-center justify-center overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1692889783742-7d99b124c402?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWwlMjB3aGl0ZSUyMGdlb21ldHJpYyUyMDNkJTIwc2hhcGVzfGVufDF8fHx8MTc2ODgxNDQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Abstract"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-white/40 to-transparent" />

                    <Card
                        variant="glass"
                        radius="xl"
                        shadow="lg"
                        padding="lg"
                        className=" z-10 max-w-xs"
                    >
                        <div className="w-12 h-12 bg-ink rounded-md flex items-center justify-center mb-4">
                            <GraduationCap className="text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-text-secondary mb-2">
                            精通力学
                        </h3>
                        <p className="text-sm text-text-muted">
                            加入数万名通过 AI 辅助掌握理论力学的学生行列。
                        </p>
                    </Card>
                </div>

                {/* Right Side - Auth Form */}
                <div className="flex-1 flex flex-col items-center p-12 relative">
                    <div className="w-full max-w-sm">
                        {isVerificationPending ? (
                            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-16 h-16 bg-success-bg rounded-pill flex items-center justify-center mb-6">
                                    <Mail className="text-success w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-text-primary mb-2">
                                    请验证您的邮箱
                                </h3>
                                <p className="text-text-muted mb-8">
                                    我们已向{" "}
                                    <span className="font-semibold text-text-primary">
                                        {email}
                                    </span>{" "}
                                    发送了一封验证邮件。
                                    <br />
                                    请点击邮件中的链接以激活您的账户。
                                </p>
                                <Button
                                    onClick={() => setMode("signin")}
                                    variant="ghost"
                                    size="sm"
                                    className="text-ink border-b-2 border-ink hover:border-transparent pb-0.5"
                                >
                                    返回登录
                                </Button>
                                <Button
                                    onClick={() =>
                                        setIsVerificationPending(false)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="mt-4 text-xs text-text-faint hover:text-text-muted"
                                >
                                    重新发送 (开发中)
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Logo */}
                                <MechHubLogo className="mb-6 justify-center" />

                                {/* Toggle */}
                                <div className="bg-(--color-fill-soft) rounded-pill flex relative mb-8">
                                    <motion.div
                                        className="absolute top-1.5 bottom-1.5 bg-(--color-surface) rounded-pill shadow-sm z-0"
                                        layoutId="authMode"
                                        initial={false}
                                        animate={{
                                            left:
                                                mode === "signin"
                                                    ? "6px"
                                                    : "50%",
                                            width: "calc(50% - 6px)",
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    />
                                    <Button
                                        onClick={() => setMode("signin")}
                                        variant="tab"
                                        size="sm"
                                        className={cn(
                                            "flex-1 relative z-10 py-2.5 text-center transition-colors",
                                            mode === "signin"
                                                ? "text-text-primary"
                                                : "text-text-subtle",
                                        )}
                                    >
                                        登录
                                    </Button>
                                    <Button
                                        onClick={() => setMode("register")}
                                        variant="tab"
                                        size="sm"
                                        className={cn(
                                            "flex-1 relative z-10 py-2.5 text-center transition-colors",
                                            mode === "register"
                                                ? "text-text-primary"
                                                : "text-text-subtle",
                                        )}
                                    >
                                        注册
                                    </Button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider mb-2 ml-1">
                                            邮箱地址
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint">
                                                <Mail size={ICON_SIZE.lg} />
                                            </div>
                                            <Input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                placeholder="student@university.edu"
                                                className="pl-11 pr-4"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2 ml-1 min-h-6">
                                            <label className="block text-xs font-bold text-text-subtle uppercase tracking-wider">
                                                密码
                                            </label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                tabIndex={
                                                    mode === "signin" ? 0 : -1
                                                }
                                                aria-hidden={mode !== "signin"}
                                                className={cn(
                                                    "text-xs font-semibold text-text-primary hover:underline",
                                                    mode === "signin"
                                                        ? "visible"
                                                        : "invisible pointer-events-none",
                                                )}
                                            >
                                                忘记密码？
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint">
                                                <Lock size={ICON_SIZE.lg} />
                                            </div>
                                            <Input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                required
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="••••••••"
                                                className="pl-11 pr-10"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-4 top-1/2 -translate-y-1/2 px-0 py-0 text-text-faint hover:text-text-muted"
                                            >
                                                {showPassword ? (
                                                    <Eye size={ICON_SIZE.md} />
                                                ) : (
                                                    <EyeOff
                                                        size={ICON_SIZE.md}
                                                    />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        size="md"
                                        className="w-full mt-8"
                                    >
                                        {isLoading ? (
                                            <Loader2
                                                size={ICON_SIZE.xl}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <>
                                                {mode === "signin"
                                                    ? "登录"
                                                    : "创建账户"}
                                                <ArrowRight
                                                    size={ICON_SIZE.lg}
                                                />
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border-subtle"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-(--color-surface) px-2 text-text-subtle">
                                            或通过以下方式继续
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Button
                                        onClick={() =>
                                            handleSocialLogin("google")
                                        }
                                        variant="soft"
                                        size="icon"
                                        title="通过 Google 继续"
                                    >
                                        <Chrome
                                            size={ICON_SIZE["2xl"]}
                                            className="text-text-secondary"
                                        />
                                    </Button>
                                    {/* Note: Google is the most common example, keeping it simple as per design */}
                                    <Button
                                        variant="soft"
                                        size="icon"
                                        title="校园账号登录 (模拟)"
                                    >
                                        <GraduationCap
                                            size={ICON_SIZE["2xl"]}
                                            className="text-text-secondary"
                                        />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};
