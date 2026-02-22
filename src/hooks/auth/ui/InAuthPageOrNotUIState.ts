//UI Statement Whether In Auth Page
import { useState } from "react";
export const InAuthPageOrNotUIState = () => {
    const [showAuth, setShowAuth] = useState(false);

    return {
        showAuth,
        setShowAuth,
    };
};
