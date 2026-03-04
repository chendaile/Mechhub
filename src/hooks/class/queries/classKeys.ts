export const classKeys = {
    all: (viewerUserId: string) => ["class", viewerUserId] as const,
    myClasses: (viewerUserId: string) => [...classKeys.all(viewerUserId), "my-classes"] as const,
    members: (viewerUserId: string, classId: string) =>
        [...classKeys.all(viewerUserId), "members", classId] as const,
    threads: (viewerUserId: string, classId: string) =>
        [...classKeys.all(viewerUserId), "threads", classId] as const,
    threadMessages: (viewerUserId: string, threadId: string) =>
        [...classKeys.all(viewerUserId), "thread-messages", threadId] as const,
};
