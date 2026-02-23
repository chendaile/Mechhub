//Profile UI Statement
import { RefObject, useEffect, useRef, useState } from "react";
import { Session, UserProfile } from "../types";
import { useProfileQuery } from "../queries/useProfile";

//Distribute profile UI statement.
export const ProfileUIState = (
    sessonRef: RefObject<Session | null>,
) => {
    const { data, updateProfileAsync, isUpdating } = useProfileQuery(
        sessonRef.current,
    );
    const [name, setName] = useState<string | null>(
        data?.name ?? null,
    );
    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        data?.avatarUrl ?? null,
    );
    const [isEditing, setIsEditing] = useState(false);
    const pendingAvatarFileRef = useRef<File | null>(null);
    const snapshotRef = useRef<UserProfile>({
        name,
        avatarUrl,
    });

    //Build snapshot of profile.
    useEffect(() => {
        if (isEditing) {
            return;
        }
        snapshotRef.current = { name, avatarUrl };
    }, [isEditing]);

    //Toggle avatar select.
    const handleAvatarSelect = (file: File) => {
        if (!isEditing) {
            return;
        }
        setAvatarUrl(URL.createObjectURL(file));
        pendingAvatarFileRef.current = file;
    };

    //Toggle save button.
    const handleSave = () => {
        if (!isEditing) {
            return;
        }
        const nextProfile = {
            name,
            avatarUrl,
            avatarFile: pendingAvatarFileRef.current,
        };

        void updateProfileAsync(nextProfile);
        pendingAvatarFileRef.current = null;
        setIsEditing(false);
    };

    //Toggle cancel button.
    const handleCancel = () => {
        if (!isEditing) {
            return;
        }
        setName(snapshotRef.current.name);
        setAvatarUrl(snapshotRef.current.avatarUrl);
        setIsEditing(false);
    };

    return {
        name,
        setName,
        avatarUrl,
        isEditing,
        setIsEditing,
        handleAvatarSelect,
        handleSave,
        handleCancel,
        isUpdating,
    };
};
