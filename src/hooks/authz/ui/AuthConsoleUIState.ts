import type { ConsoleUser, BaseRole, PermissionKeys, PermissionMode } from "../types";
import { PermissionKeyList } from "../types";
import { useState, useEffect } from "react";
import { authzInstance } from "../interface/authzInterface";

const createDefaultPermission = (): Record<PermissionKeys, PermissionMode> => {
    return PermissionKeyList.reduce(
        (acc, key) => ({
            ...acc,
            [key]: "inherit" as PermissionMode,
        }),
        {} as Record<PermissionKeys, PermissionMode>,
    );
};

export const AuthConsoleUIState = () => {
    const [selectedUser, setSelectedUser] = useState<ConsoleUser | null>(null);
    const [baseRole, setBaseRole] = useState<BaseRole>("student");
    const [permissionEffects, setPermissionEffects] =
        useState<Record<PermissionKeys, PermissionMode>>(createDefaultPermission());
    const [loadingUserPermission, setLoadingUserPermission] = useState(false);
    const [consoleUsers, setConsoleUsers] = useState<ConsoleUser[]>([]);

    // 异步获取所有控制台用户
    const getAllConsoleUsers = async () => {
        const result = await authzInstance.getAllConsoleUsers();
        setConsoleUsers(result);
    };

    // 组件挂载时加载用户列表
    useEffect(() => {
        getAllConsoleUsers();
    }, []);

    // 更新单个权限键的模式
    const setPermissionMode = (key: PermissionKeys, mode: PermissionMode) => {
        setPermissionEffects((prev) => ({
            ...prev,
            [key]: mode,
        }));
    };

    // 重置所有权限为默认值
    const resetPermissions = () => {
        setPermissionEffects(createDefaultPermission());
    };

    const selectUser = async (targetUser: ConsoleUser | null = selectedUser) => {
        if (!targetUser) return;
        setLoadingUserPermission(true);
        const userPermission = await authzInstance.getPermission(targetUser);
        setBaseRole(userPermission.baseRole);
        setPermissionEffects({
            ...userPermission,
        });
        setLoadingUserPermission(false);
    };

    const uploadPermission = async () => {
        if (!selectedUser) return;
        const payload = { baseRole, ...permissionEffects };
        await authzInstance.uploadPermission(selectedUser, payload);
    };

    return {
        selectedUser,
        setSelectedUser,
        selectUser,
        baseRole,
        setBaseRole,
        permissionEffects,
        setPermissionMode,
        resetPermissions,
        uploadPermission,
        loadingUserPermission,
        consoleUsers,
    };
};
