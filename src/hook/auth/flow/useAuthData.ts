import { useSession } from "@features/auth/queries/useSession";
import { useUserProfile } from "@features/auth/queries/useUserProfile";
import { DEFAULT_USER } from "@features/auth/constants";

export const useAuthData = () => {
    const { data: session, isLoading } = useSession();
    const { data: userProfile } = useUserProfile(session ?? null);

    return {
        session,
        loading: isLoading,
        userProfile: userProfile ?? DEFAULT_USER,
    };
};
