import type { AuthzInterface } from "../types";
import { HttpAuthzInstance } from "../implementation/httpAuthzInstance";

export const createAuthzInterface = (authzInstance: AuthzInterface): AuthzInterface => ({
    getPermission: authzInstance.getPermission,
    uploadPermission: authzInstance.uploadPermission,
    getAllConsoleUsers: authzInstance.getAllConsoleUsers,
    getMyPermission: authzInstance.getMyPermission,
});

export const authzInstance = createAuthzInterface(HttpAuthzInstance);
