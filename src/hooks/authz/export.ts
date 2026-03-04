import type { BaseRole, Permission, PermissionKeys, PermissionMode } from "./types";
import { authzInstance } from "./interface/authzInterface";

const studentPermissionEffects: Record<PermissionKeys, Exclude<PermissionMode, "inherit">> = {
    "assignment.publish": "deny",
    "assignment.grade": "deny",
    "assignment.submit": "allow",
    "assignment.feedback": "allow",
    "class.new": "deny",
    "class.delete": "deny",
    "class.threat.new": "deny",
    "class.threat.delete": "deny",
    "class.threat.rename": "deny",
};

const teacherPermissionEffects: Record<PermissionKeys, Exclude<PermissionMode, "inherit">> = {
    "assignment.publish": "allow",
    "assignment.grade": "allow",
    "assignment.submit": "deny",
    "assignment.feedback": "deny",
    "class.new": "allow",
    "class.delete": "allow",
    "class.threat.new": "allow",
    "class.threat.delete": "allow",
    "class.threat.rename": "allow",
};

const turnToRealPermission = (origin: Permission): Permission => {
    const copy = { ...origin };
    const baseRole = origin.baseRole;
    for (const key in origin) {
        const newkey = key as PermissionKeys & BaseRole;
        if (newkey === "baseRole") {
            continue;
        }
        if (origin[newkey] === "inherit") {
            if (baseRole === "student") {
                copy[newkey] = studentPermissionEffects[newkey];
            } else {
                copy[newkey] = teacherPermissionEffects[newkey];
            }
        }
    }
    return copy;
};

export const getPermission = async () => {
    const myPermission = await authzInstance.getMyPermission();
    return turnToRealPermission(myPermission);
};
