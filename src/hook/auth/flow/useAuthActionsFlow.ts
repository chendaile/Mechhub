import { authUseCases } from "@features/auth/infra/authDeps";
import { useUpdateProfile } from "@features/auth/queries/useUpdateProfile";

export const useAuthActionsFlow = () => {
    const updateProfileMutation = useUpdateProfile();

    const handleUpdateProfile = (
        name: string,
        role: string,
        avatar: string,
    ) => {
        updateProfileMutation.mutate({ name, role, avatar });
    };

    const handleSignOut = async () => {
        await authUseCases.signOut();
    };

    return {
        handleUpdateProfile,
        handleSignOut,
        isUpdating: updateProfileMutation.isPending,
    };
};
