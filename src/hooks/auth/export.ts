import { AuthPageUIState } from "./ui/AuthPageUIState";
export const getSession = () => AuthPageUIState().sessionRef.current;
