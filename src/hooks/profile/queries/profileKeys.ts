//Auth Query Keys
export const profileKeys = {
    all: ["auth"] as const,
    profile: () => [...profileKeys.all, "profile"] as const,
};
