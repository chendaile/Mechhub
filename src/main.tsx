import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "@views/routes/AppRouter";
import { AppProviders } from "@hooks/AppProviders";
import "./tailwind.css";

createRoot(document.getElementById("root")!).render(
    <AppProviders>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <AppRouter />
        </BrowserRouter>
    </AppProviders>,
);
