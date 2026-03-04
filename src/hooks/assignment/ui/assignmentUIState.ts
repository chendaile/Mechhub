import { useState } from "react";
import { ActiveView } from "../types";

export const assignmentUIState = () => {
    const [activeView, setActiveView] = useState<ActiveView | null>(null);
    return { activeView, setActiveView };
};
