export const PermissionKeyList = [
    "chat.access",
    "profile.access",
    "assignment.student.access",
    "assignment.teacher.access",
] as const;
export type PermissionKeys = (typeof PermissionKeyList)[number];
export type BaseRole = "student" | "teacher";
export const PermissionModeList = ["inherit", "allow", "deny"] as const;
export type PermissionMode = (typeof PermissionModeList)[number];

export interface Permission extends Partial<Record<PermissionKeys, PermissionMode>> {
    baseRole: BaseRole;
}

export interface ConsoleUser {
    id: string;
    email: string;
    name: string;
}

export interface AuthzInterface {
    getPermission: (consoleUser: ConsoleUser) => Promise<Permission>;
    uploadPermission: (consoleUser: ConsoleUser, payload: Permission) => Promise<void>;
    getAllConsoleUsers: () => Promise<ConsoleUser[]>;
}
