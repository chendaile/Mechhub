//Profile Query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProfileUploadPayload, UserProfile } from "../types";
import { profileInstance } from "../interface/profileInterface";
import { profileKeys } from "./profileKeys";

export const useProfileQuery = () => {
    const queryClient = useQueryClient();

    //Push to backend with rollback mechanism.
    const updateProfileMutation = useMutation({
        mutationFn: async (payload: ProfileUploadPayload) => {
            let nextAvatar = payload.avatarUrl;
            if (payload.avatarFile) {
                nextAvatar = await profileInstance.uploadAvatarUrl(payload.avatarFile);
            }

            const nextPayload: ProfileUploadPayload = {
                ...payload,
                avatarUrl: nextAvatar,
            };
            await profileInstance.uploadProfile(nextPayload);
        },
        //Actively update.
        onMutate: async (payload) => {
            const previousProfile = queryClient.getQueryData<UserProfile>(profileKeys.profile());

            queryClient.setQueryData<UserProfile>(profileKeys.profile(), {
                name: payload.name,
                avatarUrl: payload.avatarUrl,
            });

            return { previousProfile };
        },
        //Rollback to previous.
        onError: (error, _data, context) => {
            queryClient.setQueryData(profileKeys.profile(), context?.previousProfile);
            const message = error instanceof Error ? error.message : "更新个人信息失败";
            toast.error(message);
        },
        onSuccess: (nextProfile) => {
            queryClient.setQueryData(profileKeys.profile(), nextProfile);
            toast.success("个人信息已更新");
        },
    });

    //Pull profile from backend.
    const profileQuery = useQuery({
        queryKey: profileKeys.profile(),
        queryFn: () => profileInstance.downloadProfile(),
        staleTime: Infinity,
    });

    return {
        ...profileQuery,
        isUpdating: updateProfileMutation.isPending,
        updateProfileAsync: (payload: ProfileUploadPayload) =>
            updateProfileMutation.mutateAsync(payload),
    };
};
