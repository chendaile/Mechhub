import { AuthzInterface } from "../types";

const createAuthzInstance = (
    authzInstance: AuthzInterface,
): AuthzInterface => ({
    getPermission: authzInstance.getPermission,
    uploadPermission: authzInstance.uploadPermission,
    getAllConsoleUsers: authzInstance.getAllConsoleUsers,
});

export authInstance = createAuthzInstance()