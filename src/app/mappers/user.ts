import type { UserProfile as HookUserProfile } from "@hooks";
import type { UserProfile as ViewUserProfile } from "@views/shared/types";

const FALLBACK_PROFILE: ViewUserProfile = {
    name: "张同学",
    avatar: "https://images.unsplash.com/photo-1644904105846-095e45fca990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGF2YXRhcnxlbnwxfHx8fDE3Njg3OTU3NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

export const mapUserProfile = (profile: HookUserProfile | null | undefined): ViewUserProfile => ({
    name: profile?.name ?? FALLBACK_PROFILE.name,
    avatar: profile?.avatar ?? FALLBACK_PROFILE.avatar,
});
