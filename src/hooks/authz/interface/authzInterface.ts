import type { AuthzInterface } from "../types";

export const createAuthzInterface = (authzInstance: AuthzInterface): AuthzInterface => ({
    getPermission: authzInstance.getPermission,
    uploadPermission: authzInstance.uploadPermission,
    getAllConsoleUsers: authzInstance.getAllConsoleUsers,
});
