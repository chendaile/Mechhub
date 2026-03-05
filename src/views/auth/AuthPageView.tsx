import { Card } from "../shared/ui/card";
import { MechHubLogo } from "../shared/MechHubLogo";
import { AuthForm } from "./parts/AuthForm";
import { AuthHero } from "./parts/AuthHero";
import { AuthVerification } from "./parts/AuthVerification";
import { AuthMode } from "./types";
import { AuthPageUIState } from "@hooks/auth/ui/AuthPageUIState";
import { useNavigate } from "react-router-dom";

type AuthPageViewProps = {
    mode: AuthMode;
    toggleSigninMode: () => void;
    toggleRegisterMode: () => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    isLoading: boolean;
    showPassword: boolean;
    setShowPassword: (showPassword: boolean) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleSocialLogin: () => void;
    isVerificationPending: boolean;
};

const createAuthPageView = ({
    mode,
    toggleSigninMode,
    toggleRegisterMode,
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
}: AuthPageViewProps) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4">
            <Card radius="3xl" shadow="xl" className="w-full max-w-6xl h-150 flex overflow-hidden">
                <AuthHero />

                <div className="flex-1 flex flex-col items-center p-12 relative">
                    <div className="w-full max-w-sm">
                        {isVerificationPending ? (
                            <AuthVerification email={email} />
                        ) : (
                            <>
                                <MechHubLogo className="mb-6 justify-center" />
                                <AuthForm
                                    mode={mode}
                                    toggleSigninMode={toggleSigninMode}
                                    toggleRegisterMode={toggleRegisterMode}
                                    email={email}
                                    setEmail={setEmail}
                                    password={password}
                                    setPassword={setPassword}
                                    isLoading={isLoading}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    onSubmit={handleSubmit}
                                    onSocialLogin={handleSocialLogin}
                                />
                            </>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const AuthPageView = () => {
    const navigate = useNavigate();
    const state = AuthPageUIState(() => navigate("/app/chat"));
    return createAuthPageView(state);
};
