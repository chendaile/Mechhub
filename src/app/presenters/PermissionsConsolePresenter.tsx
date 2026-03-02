import { AppLoadingView } from "@views/layout/AppLoadingView";
import { PermissionsConsoleView } from "@views/admin/PermissionsConsoleView";
import { usePermissionsConsoleState } from "@hooks";

export const PermissionsConsolePresenter = () => {
    const {
        session,
        searchEmail,
        setSearchEmail,
        selectedUser,
        baseRole,
        setBaseRole,
        message,
        mode,
        onSearch,
        searchMutation,
        onSelectUser,
        selectedUserAccessQuery,
        permissionRows,
        onPermissionChange,
        upsertMutation,
        onSave,
    } = usePermissionsConsoleState();

    if (mode === "loading") {
        return <AppLoadingView />;
    }

    return (
        <PermissionsConsoleView
            mode={mode}
            requesterEmail={session?.user.email}
            searchEmail={searchEmail}
            onSearchEmailChange={setSearchEmail}
            onSearch={onSearch}
            isSearching={searchMutation.isPending}
            searchResults={searchMutation.data ?? []}
            selectedUserId={selectedUser?.id}
            selectedUserEmail={selectedUser?.email}
            onSelectUser={onSelectUser}
            isAccessLoading={selectedUserAccessQuery.isFetching}
            baseRole={baseRole}
            onBaseRoleChange={setBaseRole}
            permissionRows={permissionRows}
            onPermissionChange={onPermissionChange}
            effectivePermissions={selectedUserAccessQuery.data?.effectivePermissions ?? []}
            isSaving={upsertMutation.isPending}
            onSave={onSave}
            message={message}
        />
    );
};
