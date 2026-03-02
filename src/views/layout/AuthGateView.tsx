import React from "react";

interface AuthGateViewProps {
    showAuth: boolean;
    authView: React.ReactNode;
    landingView: React.ReactNode;
}

export const AuthGateView = ({ showAuth, authView, landingView }: AuthGateViewProps) => {
    if (showAuth) {
        return authView;
    }

    return landingView;
};
