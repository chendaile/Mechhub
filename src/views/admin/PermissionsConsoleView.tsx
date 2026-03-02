import { AppLoadingView } from "../layout/AppLoadingView";
import { Button } from "../shared/ui/button";
type PermissionEffect = "inherit" | "allow" | "deny";

interface PermissionRow {
    key: string;
    label: string;
    effect: PermissionEffect;
}

interface SearchUser {
    id: string;
    email: string;
    name: string;
}

interface PermissionsConsoleViewProps {
    mode: "loading" | "forbidden" | "ready";
    requesterEmail?: string;
    searchEmail: string;
    onSearchEmailChange: (value: string) => void;
    onSearch: () => void;
    isSearching: boolean;
    searchResults: SearchUser[];
    selectedUserId?: string;
    selectedUserEmail?: string;
    onSelectUser: (userId: string) => void;
    isAccessLoading: boolean;
    baseRole: "student" | "teacher";
    onBaseRoleChange: (value: "student" | "teacher") => void;
    permissionRows: PermissionRow[];
    onPermissionChange: (key: string, effect: PermissionEffect) => void;
    effectivePermissions: string[];
    isSaving: boolean;
    onSave: () => void;
    message?: string;
}

export const PermissionsConsoleView = ({
    mode,
    requesterEmail,
    searchEmail,
    onSearchEmailChange,
    onSearch,
    isSearching,
    searchResults,
    selectedUserId,
    selectedUserEmail,
    onSelectUser,
    isAccessLoading,
    baseRole,
    onBaseRoleChange,
    permissionRows,
    onPermissionChange,
    effectivePermissions,
    isSaving,
    onSave,
    message,
}: PermissionsConsoleViewProps) => {
    if (mode === "loading") {
        return AppLoadingView();
    }

    if (mode === "forbidden") {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 p-6">
                <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 font-['courier_new']">
                        403 Forbidden
                    </h1>
                    <p className="mt-3 text-sm text-slate-600">当前账号没有权限访问控制台。</p>
                    {requesterEmail && (
                        <p className="mt-2 text-xs text-slate-500">当前账号: {requesterEmail}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <header className="mx-auto">
                    <h1 className="text-5xl font-bold text-slate-900 font-['courier_new']">
                        Permissions Console
                    </h1>
                    {requesterEmail && (
                        <p className="mt-2 text-xs text-slate-500">Admin: {requesterEmail}</p>
                    )}
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex flex-col gap-3 md:flex-row">
                        <input
                            type="email"
                            value={searchEmail}
                            onChange={(event) => onSearchEmailChange(event.target.value)}
                            placeholder="Search by user email"
                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400"
                        />
                        <button
                            type="button"
                            onClick={onSearch}
                            disabled={isSearching}
                            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSearching ? "Searching..." : "Search"}
                        </button>
                    </div>

                    <div className="mt-4 grid gap-2">
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => onSelectUser(user.id)}
                                    className={`rounded-xl border px-4 py-3 text-left transition ${
                                        selectedUserId === user.id
                                            ? "border-slate-400 bg-slate-100"
                                            : "border-slate-200 bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="text-sm font-semibold text-slate-800">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </button>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                                No users found.
                            </div>
                        )}
                    </div>
                </section>

                {selectedUserId && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-3xl text-slate-900 font-bold font-['courier_new']">
                                    Access Control
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Target: {selectedUserEmail ?? selectedUserId}
                                </p>
                            </div>
                            {isAccessLoading && (
                                <p className="text-sm text-slate-500">Loading access...</p>
                            )}
                        </div>

                        <label className="mt-5 block text-sm font-medium text-slate-700">
                            Base Role
                            <select
                                value={baseRole}
                                onChange={(event) =>
                                    onBaseRoleChange(event.target.value as "student" | "teacher")
                                }
                                className="mt-2 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400"
                            >
                                <option value="student">student</option>
                                <option value="teacher">teacher</option>
                            </select>
                        </label>

                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full min-w-[640px] border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                                        <th className="px-3">Permission</th>
                                        <th className="px-3">Effect</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissionRows.map((row) => (
                                        <tr
                                            key={row.key}
                                            className="rounded-xl border border-slate-200 bg-slate-50"
                                        >
                                            <td className="px-3 py-3 text-sm text-slate-800 ">
                                                {row.label}
                                            </td>
                                            <td className="px-3 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {(["inherit", "allow", "deny"] as const).map(
                                                        (effect) => (
                                                            <Button
                                                                key={effect}
                                                                type="button"
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    onPermissionChange(
                                                                        row.key,
                                                                        effect,
                                                                    )
                                                                }
                                                                className={` ${
                                                                    row.effect === effect
                                                                        ? "bg-slate-900 text-white"
                                                                        : "bg-white text-slate-700 hover:bg-slate-100"
                                                                }`}
                                                            >
                                                                {effect}
                                                            </Button>
                                                        ),
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-2xl font-semibold uppercase tracking-wide text-slate-500 font-['courier_new']">
                                Effective Permissions
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {effectivePermissions.length > 0 ? (
                                    effectivePermissions.map((permission) => (
                                        <span
                                            key={permission}
                                            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                                        >
                                            {permission}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-500">
                                        No effective permissions.
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                            {message && <p className="text-sm text-slate-600">{message}</p>}
                            <button
                                type="button"
                                disabled={isSaving}
                                onClick={onSave}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving ? "Saving..." : "Save Access"}
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
