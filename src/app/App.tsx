import { Navigate, Route, Routes } from "react-router-dom";
import { AppPresenter } from "./presenters/AppPresenter";
import { PermissionsConsolePresenter } from "./presenters/PermissionsConsolePresenter";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<AppPresenter />} />
            <Route path="/_internal/permissions" element={<PermissionsConsolePresenter />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
