export const PermissionKeyList = [
    "chat.access",
    "profile.access",
    "assignment.student.access",
    "assignment.teacher.access",
] as const;
export type PermissionKeys = (typeof PermissionKeyList)[number];
export type BaseRole = "student" | "teacher";
export type PermissionModeList = ["inherit", "allow", "deny"];
export type PermissionMode = (typeof PermissionKeyList)[number];

export interface Permission extends Partial<
    Record<PermissionKeys, PermissionMode>
> {
    baseRole: BaseRole;
}

export interface ConsoleUser {
    id: string;
    email: string;
    name: string;
}

export interface AuthzInterface {
    getPermission: (consoleUser: ConsoleUser) => Promise<Permission>;
    uploadPermission: (
        consoleUser: ConsoleUser,
        payload: Permission,
    ) => Promise<void>;
    getAllConsoleUsers: () => Promise<ConsoleUser[]>;
}
