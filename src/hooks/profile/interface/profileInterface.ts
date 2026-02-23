//Avatar Upload Interface
import { ProfileInterface } from "../types";

//Pass in an instance class
const profileInterface = (
    profileInstance: ProfileInterface,
): ProfileInterface => ({
    uploadProfile: profileInstance.uploadProfile,
    downloadProfile: profileInstance.downloadProfile,
    uploadAvatarUrl: profileInstance.uploadAvatarUrl,
});

export const profileInstance = profileInterface(
    supabaseProfileInterface,
);
