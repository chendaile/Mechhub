import {
    persistSidebarWidth as persistSidebarWidthInstance,
    readSidebarWidth as readSidebarWidthInstance,
} from "../implementation/sidebarWidthInstance";
import type { SidebarWidthConfig } from "../types";

export interface SidebarInterface {
    readSidebarWidth: (config: SidebarWidthConfig) => number;
    persistSidebarWidth: (width: number, config: SidebarWidthConfig) => void;
}

export const readSidebarWidth = (config: SidebarWidthConfig) => readSidebarWidthInstance(config);

export const persistSidebarWidth = (width: number, config: SidebarWidthConfig) =>
    persistSidebarWidthInstance(width, config);

export const createSidebarInstance = (): SidebarInterface => ({
    readSidebarWidth,
    persistSidebarWidth,
});

export const sidebarInstance = createSidebarInstance();

export type { SidebarWidthConfig };
