import { createLandingPageHandlers } from "@hooks";
import { LandingPageView } from "@views/landing/LandingPageView";

interface LandingPagePresenterProps {
    onStart: () => void;
    onLogin: () => void;
}

export const LandingPagePresenter = ({ onStart, onLogin }: LandingPagePresenterProps) => {
    const { handleStart, handleLogin } = createLandingPageHandlers(onStart, onLogin);

    return <LandingPageView onStart={handleStart} onLogin={handleLogin} />;
};
