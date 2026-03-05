import type { AuthzInterface } from "../types";
import { httpClient } from "../../shared/httpClient";

export const HttpAuthzInstance: AuthzInterface = {
    async getPermission(userId: string) {
        return httpClient.get(`/authz/users/${userId}`);
    },
    async uploadPermission(userId: string, payload) {
        await httpClient.put(`/authz/users/${userId}`, payload);
    },
    async getAllConsoleUsers() {
        return httpClient.get("/authz/users");
    },
    async getMyPermission() {
        return httpClient.get("/authz/me");
    },
};
