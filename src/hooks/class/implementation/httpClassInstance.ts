import type {
    Class,
    ClassInterface,
    ClassMembers,
    ClassThread,
    ClassThreadMessage,
    CreateClassPayload,
    DeleteClassThreadPayload,
    MyClassContext,
    PostClassMessagePayload,
    RenameClassThreadPayload,
} from "../types";
import { httpClient } from "../../shared/httpClient";

export const HttpClassInstance: ClassInterface = {
    async getMyClass(): Promise<MyClassContext> {
        return httpClient.get<MyClassContext>("/class/my");
    },
    async getClassMembers(classId: string): Promise<ClassMembers> {
        return httpClient.get<ClassMembers>(`/class/${classId}/members`);
    },
    async getClassThreads(classId: string): Promise<ClassThread[]> {
        return httpClient.get<ClassThread[]>(`/class/${classId}/threads`);
    },
    async getClassThreadMessages(threadId: string): Promise<ClassThreadMessage[]> {
        return httpClient.get<ClassThreadMessage[]>(`/class/threads/${threadId}/messages`);
    },
    async createClass(payload: CreateClassPayload): Promise<Class> {
        return httpClient.post<Class>("/class", payload);
    },
    async deleteClass(classId: string): Promise<{ success?: boolean; message?: string }> {
        return httpClient.del<{ success?: boolean; message?: string }>(`/class/${classId}`);
    },
    async leaveClass(classId: string): Promise<{ success?: boolean; message?: string }> {
        return httpClient.post<{ success?: boolean; message?: string }>(`/class/${classId}/leave`);
    },
    async joinClass(inviteCode: string): Promise<Class> {
        return httpClient.post<Class>("/class/join", { inviteCode });
    },
    async createClassThread(classId: string, title: string): Promise<ClassThread> {
        return httpClient.post<ClassThread>(`/class/${classId}/threads`, { title });
    },
    async renameClassThread(payload: RenameClassThreadPayload): Promise<ClassThread> {
        return httpClient.patch<ClassThread>(
            `/class/${payload.classId}/threads/${payload.threadId}`,
            { title: payload.title },
        );
    },
    async deleteClassThread(
        payload: DeleteClassThreadPayload,
    ): Promise<{ success?: boolean; message?: string }> {
        return httpClient.del<{ success?: boolean; message?: string }>(
            `/class/${payload.classId}/threads/${payload.threadId}`,
        );
    },
    async postClassMessage(payload: PostClassMessagePayload): Promise<ClassThreadMessage[]> {
        return httpClient.post<ClassThreadMessage[]>(
            `/class/threads/${payload.threadId}/messages`,
            payload,
        );
    },
};
