import { createLandingPageHandlers } from "./createLandingPageHandlers";

export const LandingUIState = (onStart: () => void, onLogin: () => void) => {
    return createLandingPageHandlers(onStart, onLogin);
};
