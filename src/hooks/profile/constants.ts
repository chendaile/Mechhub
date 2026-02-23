//Turn any string to a avatar.
const buildDefaultAvatar = (seed: string) =>
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(
        seed,
    )}`;

export const getDefaultProfile = (email: string) => {
    return {
        name: "YourName",
        avatar: buildDefaultAvatar(email),
    };
};
