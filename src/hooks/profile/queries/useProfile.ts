//Profile Query
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authKeys } from "./authKeys";
import { authInstance } from "../interface/authInterface";
import { avatarUploadInstance } from "../avatarUploadInterface";
import type {
    AuthSession,
    ProfileUploadPayload,
    UserProfile,
} from "../types";

export const useProfileQuery = (session: AuthSession | null) => {
    const queryClient = useQueryClient();

    //Push to backend with rollback mechanism.
    const updateProfileMutation = useMutation({
        mutationFn: async (payload: ProfileUploadPayload) => {
            let nextAvatar = payload.avatar;
            if (payload.avatarFile) {
                const userId = session?.user?.id;
                if (!userId) {
                    throw new Error("未登录，无法上传头像");
                }
                const result =
                    await avatarUploadInstance.uploadAvatarFn(
                        userId,
                        payload.avatarFile,
                    );
                nextAvatar = result.publicUrl;
            }

            const nextPayload: ProfileUploadPayload = {
                ...payload,
                avatar: nextAvatar,
            };
            await authInstance.updateUser(nextPayload);

            return {
                name: nextPayload.name,
                avatar: nextPayload.avatar,
            };
        },
        //Actively update.
        onMutate: async (payload) => {
            await queryClient.cancelQueries({
                queryKey: authKeys.profile(),
            });
            const previousProfile =
                queryClient.getQueryData<UserProfile>(
                    authKeys.profile(),
                );

            queryClient.setQueryData<UserProfile>(
                authKeys.profile(),
                {
                    name: payload.name,
                    avatar: payload.avatar,
                },
            );

            return { previousProfile };
        },
        //Rollback to previous.
        onError: (error, _data, context) => {
            if (context.previousProfile) {
                queryClient.setQueryData(
                    authKeys.profile(),
                    context.previousProfile,
                );
            }
            const message =
                error instanceof Error
                    ? error.message
                    : "更新个人信息失败";
            toast.error(message);
        },
        onSuccess: (nextProfile) => {
            queryClient.setQueryData(authKeys.profile(), nextProfile);
            toast.success("个人信息已更新");
        },
    });

    //Session change and profile change.
    useEffect(() => {
        queryClient.setQueryData(
            authKeys.profile(),
            authInstance.parseUserProfile(session),
        );
    }, [queryClient, session]);

    //Pull profile from backend.
    const profileQuery = useQuery({
        queryKey: authKeys.profile(),
        queryFn: () => authInstance.parseUserProfile(session),
        initialData: authInstance.parseUserProfile(session),
        staleTime: Infinity,
    });

    return {
        ...profileQuery,
        isUpdating: updateProfileMutation.isPending,
        updateProfile: (payload: ProfileUploadPayload) => {
            updateProfileMutation.mutate(payload);
        },
        updateProfileAsync: (payload: ProfileUploadPayload) =>
            updateProfileMutation.mutateAsync(payload),
    };
};
