const buildDefaultAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(
        seed,
    )}`;

const normalizeEmailSeed = (email: string) =>
    email.trim().toLowerCase() || "unknown";

export const getSignupDefaultProfile = (email: string) => {
    const seed = normalizeEmailSeed(email);

    return {
        name: "YourName",
        avatar: buildDefaultAvatar(seed),
    };
};
