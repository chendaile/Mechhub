//Profile UI Statement
import { useEffect, useRef, useState } from "react";
import { useSessionQuery } from "./queries/useSession";
import { useProfileQuery } from "./queries/useProfile";
import type { UserProfile } from "./types";

//Distribute profile UI statement.
export const useProfileState = () => {
    const { data: session } = useSessionQuery();
    const {
        data: profile,
        updateProfileAsync,
        isUpdating,
    } = useProfileQuery(session);
    const profileName = profile.name;
    const profileAvatar = profile.avatar;
    const [name, setName] = useState(profileName);
    const [avatar, setAvatar] = useState(profileAvatar);
    const [isEditing, setIsEditingState] = useState(false);
    const [pendingAvatarFile, setPendingAvatarFile] =
        useState<File | null>(null);
    const previewUrlRef = useRef<string | null>(null);
    const snapshotRef = useRef<UserProfile | null>(null);

    const clearPreviewDraft = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
        setPendingAvatarFile(null);
    };

    //Clear blob data when shut down.
    useEffect(() => {
        return () => {
            clearPreviewDraft();
        };
    }, []);

    useEffect(() => {
        if (isEditing) {
            return;
        }
        setName(profileName);
        setAvatar(profileAvatar);
    }, [isEditing, profileAvatar, profileName]);

    const setIsEditing = (editing: boolean) => {
        if (editing && !isEditing) {
            snapshotRef.current = {
                name: profileName,
                avatar: profileAvatar,
            };
        }

        if (!editing) {
            snapshotRef.current = null;
        }

        setIsEditingState(editing);
    };

    //Toggle avatar select.
    const handleAvatarSelect = (file: File) => {
        if (!isEditing) {
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        //Clear existing blob url.
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }
        previewUrlRef.current = previewUrl;
        setPendingAvatarFile(file);
        setAvatar(previewUrl);
    };

    //Toggle save button.
    const handleSave = () => {
        if (!isEditing) {
            return;
        }
        const nextProfile = {
            name,
            avatar,
            avatarFile: pendingAvatarFile,
        };

        void updateProfileAsync(nextProfile).catch(() => undefined);
        setPendingAvatarFile(null);
        snapshotRef.current = null;
        setIsEditingState(false);
    };

    //Toggle cancel button.
    const handleCancel = () => {
        if (!isEditing) {
            return;
        }

        const snapshot = snapshotRef.current ?? {
            name: profileName,
            avatar: profileAvatar,
        };
        clearPreviewDraft();
        setName(snapshot.name);
        setAvatar(snapshot.avatar);
        snapshotRef.current = null;
        setIsEditingState(false);
    };

    return {
        name,
        setName,
        avatar,
        isEditing,
        setIsEditing,
        handleAvatarSelect,
        handleSave,
        handleCancel,
        isUpdating,
    };
};
