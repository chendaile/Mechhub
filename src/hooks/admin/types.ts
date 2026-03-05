export const PermissionKeyList = [
    "assignment.publish",
    "assignment.grade",
    "assignment.submit",
    "assignment.feedback",
    "class.new",
    "class.delete",
    "class.threat.new",
    "class.threat.delete",
    "class.threat.rename",
] as const;
export type PermissionKeys = (typeof PermissionKeyList)[number];
export type BaseRole = "student" | "teacher";
export const PermissionModeList = ["inherit", "allow", "deny"] as const;
export type PermissionMode = (typeof PermissionModeList)[number];

export interface Permission extends Record<PermissionKeys, PermissionMode> {
    baseRole: BaseRole;
}

export interface AuthzInterface {
    getPermission: (userId: string) => Promise<Permission>;
    uploadPermission: (userId: string, payload: Permission) => Promise<void>;
    getAllConsoleUsers: () => Promise<string[]>;
    getMyPermission: () => Promise<Permission>;
}
