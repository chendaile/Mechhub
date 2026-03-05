import { Button } from "../shared/ui/button";
import { AuthConsoleUIState } from "@hooks/admin/ui/AuthConsoleUIState";
import {
    PermissionKeyList,
    PermissionModeList,
    type PermissionKeys,
    type PermissionMode,
} from "@hooks/admin/types";

type PermissionsConsoleViewProps = ReturnType<typeof AuthConsoleUIState>;

const createPermissionsConsoleView = ({
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
}: PermissionsConsoleViewProps) => {
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <header className="mx-auto text-center">
                    <h1 className="text-5xl font-bold text-slate-900 font-['courier_new']">
                        Permissions Console
                    </h1>
                    <p className="mt-2 text-xs text-slate-500">
                        Select a user to view and update permissions.
                    </p>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-2xl font-semibold text-slate-900 font-['courier_new']">
                            Console Users
                        </h2>
                        {loadingUserPermission && (
                            <span className="text-sm text-slate-500">Loading user access…</span>
                        )}
                    </div>

                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                        {consoleUsers.length > 0 ? (
                            consoleUsers.map((userId) => (
                                <button
                                    key={userId}
                                    type="button"
                                    onClick={() => {
                                        setSelectedUser(userId);
                                        void selectUser(userId);
                                    }}
                                    className={`rounded-xl border px-4 py-3 text-left transition ${
                                        selectedUser === userId
                                            ? "border-slate-400 bg-slate-100"
                                            : "border-slate-200 bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="text-sm font-semibold text-slate-800">
                                        {userId}
                                    </div>
                                    <div className="text-xs text-slate-500">Console user</div>
                                </button>
                            ))
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                                No console users found.
                            </div>
                        )}
                    </div>
                </section>

                {selectedUser && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-3xl text-slate-900 font-bold font-['courier_new']">
                                    Access Control
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Target: {selectedUser}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => resetPermissions()}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    onClick={() => void uploadPermission()}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                                >
                                    Save Access
                                </button>
                            </div>
                        </div>

                        <label className="mt-5 block text-sm font-medium text-slate-700">
                            Base Role
                            <select
                                value={baseRole}
                                onChange={(event) =>
                                    setBaseRole(event.target.value as "student" | "teacher")
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
                                    {PermissionKeyList.map((key) => {
                                        const effect = permissionEffects[key];
                                        return (
                                            <tr
                                                key={key}
                                                className="rounded-xl border border-slate-200 bg-slate-50"
                                            >
                                                <td className="px-3 py-3 text-sm text-slate-800">
                                                    {key}
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {PermissionModeList.map((mode) => (
                                                            <Button
                                                                key={mode}
                                                                type="button"
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setPermissionMode(
                                                                        key as PermissionKeys,
                                                                        mode as PermissionMode,
                                                                    )
                                                                }
                                                                className={`${
                                                                    effect === mode
                                                                        ? "bg-slate-900 text-white"
                                                                        : "bg-white text-slate-700 hover:bg-slate-100"
                                                                }`}
                                                            >
                                                                {mode}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export const PermissionsConsoleView = () => {
    const state = AuthConsoleUIState();
    return createPermissionsConsoleView(state);
};
