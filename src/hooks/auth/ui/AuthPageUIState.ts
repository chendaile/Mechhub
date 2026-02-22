//UI Statement in Authpage.
import { useState } from "react";
import { toast } from "sonner";
import { AuthMode } from "../types";
import { authInstance } from "../interface/authInterface";
import { getErrorMessage } from "../utils/GetErrorMessage";

//Distribute Auth Page UI Statement.
export const AuthPageUIState = () => {
    const [mode, setMode] = useState<AuthMode>("signin");
    const [isVerificationPending, setIsVerificationPending] =
        useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    //When toggle the "Register" or "Signin" Button.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === "signin") {
                const session = await authInstance.signIn(
                    email,
                    password,
                );
                localStorage.setItem(
                    "Auth.Session",
                    JSON.stringify(session),
                );
                toast.success("欢迎回来！");
            } else if (mode === "register") {
                const session = await authInstance.signUp(
                    email,
                    password,
                );
                localStorage.setItem(
                    "Auth.Session",
                    JSON.stringify(session),
                );
                setIsVerificationPending(true);
                toast.success(
                    "账户创建成功！请检查您的邮箱完成验证。",
                );
            }
        } catch (error: unknown) {
            toast.error(
                error instanceof Error ? error.message : "操作失败",
            );
        } finally {
            setIsLoading(false);
        }
    };

    //When toggle social login button. Under Development.
    const handleSocialLogin = async () => {
        toast.warning("Oauth授权开发中");
    };

    const toggleSigninMode = () => {
        setMode("signin");
    };

    const toggleRegisterMode = () => {
        setMode("register");
    };

    const toggleShowPassword = () => {
        setShowPassword(true);
    };

    const toggleHidePassword = () => {
        setShowPassword(false);
    };

    return {
        mode,
        toggleSigninMode,
        toggleRegisterMode,
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        showPassword,
        toggleHidePassword,
        toggleShowPassword,
        handleSubmit,
        handleSocialLogin,
        isVerificationPending,
        setIsVerificationPending,
    };
};
