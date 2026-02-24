//Profile UI Statement
import { useEffect, useRef, useState } from "react";
import { UserProfile } from "../types";
import { useProfileQuery } from "../queries/useProfile";

//Distribute profile UI statement.
export const ProfileUIState = () => {
    const { data, updateProfileAsync, isUpdating } =
        useProfileQuery();
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
    const profile: UserProfile = { name, avatarUrl };

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
    const handleSave = async () => {
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
        profile,
    };
};
