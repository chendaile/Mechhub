//Avatar Upload Interface
import { ProfileInterface } from "../types";
import { HttpProfileInstance } from "../implementation/httpProfileInstance";

//Pass in an instance class
const profileInterface = (profileInstance: ProfileInterface): ProfileInterface => ({
    uploadProfile: profileInstance.uploadProfile,
    downloadProfile: profileInstance.downloadProfile,
    uploadAvatarUrl: profileInstance.uploadAvatarUrl,
});

export const profileInstance = profileInterface(HttpProfileInstance);
