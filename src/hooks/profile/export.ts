import { ProfileUIState } from "./ui/ProfileUIState";

const { name, avatarUrl } = ProfileUIState();
export const getProfile = () => ({ name, avatarUrl });
