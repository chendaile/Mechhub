import { useEffect, useState } from "react";

interface SelectableClass {
    id: string;
}

export const SelectedClassUIState = (classOptions: SelectableClass[]) => {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedClassId) {
            return;
        }

        const exists = classOptions.some((classItem) => classItem.id === selectedClassId);
        if (!exists) {
            setSelectedClassId(null);
        }
    }, [classOptions, selectedClassId]);

    return {
        state: {
            selectedClassId,
        },
        actions: {
            setSelectedClassId,
        },
        selectedClassId,
        setSelectedClassId,
    };
};
