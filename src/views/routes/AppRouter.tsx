import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthPageView } from "@views/auth";
import { LandingPageContainer } from "@views/landing/LandingPageView";
import { ChatPageView } from "@views/chat";
import { ProfileView } from "@views/profile/ProfileView";
import { ClassHubPageView } from "@views/class";
import { AssignmentHubView } from "@views/assignment";
import { PermissionsConsoleView } from "@views/admin/PermissionsConsoleView";
import { SidebarPageView } from "@views/sidebar";

const SidebarRouteView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return <SidebarPageView pathname={location.pathname} navigate={navigate} />;
};

const ShellRoutes = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden">
            <SidebarRouteView />
            <div className="flex-1 min-w-0">
                <Routes>
                    <Route path="chat" element={<ChatPageView />} />
                    <Route path="profile" element={<ProfileView />} />
                    <Route path="class" element={<ClassHubPageView />} />
                    <Route path="assignment" element={<AssignmentHubView />} />
                    <Route
                        path="assignment/submit"
                        element={<AssignmentHubView forcedActiveView="Submit" />}
                    />
                    <Route
                        path="assignment/feedback"
                        element={<AssignmentHubView forcedActiveView="Feedback" />}
                    />
                    <Route
                        path="assignment/publish"
                        element={<AssignmentHubView forcedActiveView="Publish" />}
                    />
                    <Route
                        path="assignment/grade"
                        element={<AssignmentHubView forcedActiveView="Grade" />}
                    />
                    <Route path="admin" element={<PermissionsConsoleView />} />
                    <Route path="*" element={<Navigate to="chat" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export const AppRouter = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route
                path="/landing"
                element={
                    <LandingPageContainer
                        onStart={() => navigate("/auth")}
                        onLogin={() => navigate("/auth")}
                    />
                }
            />
            <Route path="/auth" element={<AuthPageView />} />
            <Route path="/app/*" element={<ShellRoutes />} />
            <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
            <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
            <Route path="/class" element={<Navigate to="/app/class" replace />} />
            <Route path="/assignment/*" element={<Navigate to="/app/assignment" replace />} />
            <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
            <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
    );
};
