import { SidebarPageUIState } from "@hooks/sidebar/ui/SidebarPageUIState";
import { Sidebar } from "./containers/Sidebar";

type SidebarPageViewProps = ReturnType<typeof SidebarPageUIState>;

const createSidebarPageView = (props: SidebarPageViewProps) => {
    return <Sidebar {...props} />;
};

export const SidebarPageView = ({
    pathname,
    navigate,
}: {
    pathname: string;
    navigate: (path: string) => void;
}) => {
    const state = SidebarPageUIState({ pathname, navigate });
    return createSidebarPageView(state);
};
