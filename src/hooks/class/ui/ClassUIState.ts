import { useState } from "react";
import { ClassActiveView } from "../types";
import { createClass } from "../queries/ClassMutationHooks";

export const classUIState = () => {
    const [classActiveView, setClassActiveView] = useState<ClassActiveView>("collection");
    const [classInviteCode, setClassInviteCode] = useState<string>("");
    const [className, setClassName] = useState<string>("");
    const [classDescription, setClassDescription] = useState<string>("");

    const toggleNewClass = async () => {
        const createclass = await createClass();
        await createclass?.mutateAsync({ name: className, description: classDescription });
        setClassDescription("");
        setClassName("");
        setClassInviteCode("");
    };

    return {
        classActiveView,
        setClassActiveView,
        classInviteCode,
        setClassInviteCode,
        className,
        setClassName,
        classDescription,
        setClassDescription,
        toggleNewClass,
    };
};
