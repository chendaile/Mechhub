export type ClassRole = "teacher" | "student";

export interface ClassMember {
    classRole: ClassRole;
    userId: string;
    name: string;
    email: string;
    avatar: string;
}

export interface Class {
    classId: string;
    className: string;
    description: string;
    createdAt: string;
    inviteCode: string;
}

export interface ClassThread {
    threadId: string;
    classId: string;
    title: string;
    createdByUserId: string;
    createdAt: string;
    updatedAt: string;
}

export type ClassThreadMessageRole = "user" | "assistant";

export interface ClassThreadMessage {
    id: string;
    threadId: string;
    senderUserId: string;
    senderName: string;
    senderEmail: string;
    senderAvatar: string;
    role: ClassThreadMessageRole;
    content: Record<string, string>;
    isMentionsAi: boolean;
    createdAt: string;
}

export interface PostClassMessagePayload {
    threadId: string;
    content?: string;
    chatId?: string;
}

export interface PostClassMessageContext {
    previousMessages: ClassThreadMessage[];
    isSharing: boolean;
}

export type ClassActiveView = "collection" | "dashboard" | "thread";

export type MyClassContext = {
    teachingClasses: Class[];
    joinedClasses: Class[];
};

export type ClassMembers = {
    classId: string;
    teachers: ClassMember[];
    students: ClassMember[];
};

export type CreateClassPayload = {
    name: string;
    description: string;
};

export type RenameClassThreadPayload = {
    classId: string;
    threadId: string;
    title: string;
};

export type DeleteClassThreadPayload = {
    classId: string;
    threadId: string;
};

export interface ClassInterface {
    getMyClass: () => Promise<MyClassContext>;
    getClassMembers: (classId: string) => Promise<ClassMembers>;
    getClassThreads: (classId: string) => Promise<ClassThread[]>;
    getClassThreadMessages: (threadId: string) => Promise<ClassThreadMessage[]>;
    createClass: (payload: CreateClassPayload) => Promise<Class>;
    deleteClass: (classId: string) => Promise<{ success?: boolean; message?: string }>;
    leaveClass: (classId: string) => Promise<{ success?: boolean; message?: string }>;
    joinClass: (inviteCode: string) => Promise<Class>;
    createClassThread: (classId: string, title: string) => Promise<ClassThread>;
    renameClassThread: (payload: RenameClassThreadPayload) => Promise<ClassThread>;
    deleteClassThread: (
        payload: DeleteClassThreadPayload,
    ) => Promise<{ success?: boolean; message?: string }>;
    postClassMessage: (payload: PostClassMessagePayload) => Promise<ClassThreadMessage[]>;
}
