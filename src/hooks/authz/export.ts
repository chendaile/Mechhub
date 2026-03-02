import { AuthConsoleUIState } from "./ui/AuthConsoleUIState";
import type { Permission, PermissionKeys, PermissionMode } from "./types";

const studentPermissionEffects: Record<PermissionKeys, Exclude<PermissionMode, "inherit">> = {
    "chat.access": "allow",
    "profile.access": "allow",
    "assignment.student.access": "allow",
    "assignment.teacher.access": "deny",
};

const teacherPermissionEffects: Record<PermissionKeys, Exclude<PermissionMode, "inherit">> = {
    "chat.access": "allow",
    "profile.access": "allow",
    "assignment.student.access": "deny",
    "assignment.teacher.access": "allow",
};

const resolveInheritedMode = (
    baseRole: Permission["baseRole"],
    key: PermissionKeys,
    mode: PermissionMode | undefined,
): Exclude<PermissionMode, "inherit"> => {
    if (mode === "allow" || mode === "deny") {
        return mode;
    }

    return baseRole === "teacher" ? teacherPermissionEffects[key] : studentPermissionEffects[key];
};

export const getPermission = (): Permission => {
    const { baseRole, permissionEffects } = AuthConsoleUIState();

    return {
        baseRole,
        "chat.access": resolveInheritedMode(
            baseRole,
            "chat.access",
            permissionEffects["chat.access"],
        ),
        "profile.access": resolveInheritedMode(
            baseRole,
            "profile.access",
            permissionEffects["profile.access"],
        ),
        "assignment.student.access": resolveInheritedMode(
            baseRole,
            "assignment.student.access",
            permissionEffects["assignment.student.access"],
        ),
        "assignment.teacher.access": resolveInheritedMode(
            baseRole,
            "assignment.teacher.access",
            permissionEffects["assignment.teacher.access"],
        ),
    };
};
