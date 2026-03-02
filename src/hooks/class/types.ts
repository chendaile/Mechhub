export type ClassRole = "teacher" | "student";

export interface ClassMember {
    classRole: ClassRole;
    userId: string;
    name: string;
    email: string;
    avatar?: string | null;
}

export interface Class {
    classId: string;
    className: string;
    description?: string;
    createdAt: string;
}

// 班级话题或分享线程的基础信息。
export interface ClassThread {
    id: string;
    classId: string;
    title: string;
    createdByUserId: string | null;
    createdAt: string;
    updatedAt: string;
}

// 班级线程消息的发送者角色。
export type ClassThreadMessageRole = "user" | "assistant";

// 班级线程中的单条消息结构。
export interface ClassThreadMessage {
    id: string;
    threadId: string;
    senderUserId?: string | null;
    senderName?: string | null;
    senderEmail?: string | null;
    senderAvatar?: string | null;
    role: ClassThreadMessageRole;
    content: Record<string, string>;
    isMentionsAi: boolean;
    createdAt: string;
}

// 生成邀请码时可选的有效期和使用次数限制。
export interface CreateInviteCodePayload {
    classId: string;
    expiresInHours?: number;
    maxUses?: number | null;
}

// 向班级线程发消息时允许直接传文本或结构化内容。
export interface PostClassMessagePayload {
    threadId: string;
    content?: string;
    chatId?: string;
}

export interface PostClassMessageContext {
    previousMessages: ClassThreadMessage[];
    isSharing: boolean;
}

export type ClassActiveView = "collection" | "dashboard";

export type MyClassContext = {
    teachingClasses: Class[];
    joinedClasses: Class[];
};

export type ClassMembers = {
    classId: string;
    teachers: ClassMember[];
    students: ClassMember[];
};

export interface rawMessage {
    message?: string;
}

export type CreateClassPayload = {
    name: string;
    description?: string;
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
    getMyClassContext: () => Promise<MyClassContext>;
    listClassMembers: (classId: string) => Promise<ClassMembers>;
    listClassThreads: (classId: string) => Promise<ClassThread[]>;
    getClassThreadMessages: (threadId: string) => Promise<ClassThreadMessage[]>;
    createClass: (payload: CreateClassPayload) => Promise<Class>;
    deleteClass: (classId: string) => Promise<{ success?: boolean; message?: string }>;
    leaveClass: (classId: string) => Promise<{ success?: boolean; message?: string }>;
    joinClassByInviteCode: (inviteCode: string) => Promise<Class>;
    createGroupThread: (classId: string, title: string) => Promise<ClassThread>;
    renameClassThread: (payload: RenameClassThreadPayload) => Promise<ClassThread>;
    deleteClassThread: (
        payload: DeleteClassThreadPayload,
    ) => Promise<{ success?: boolean; message?: string }>;
    postClassMessage: (payload: PostClassMessagePayload) => Promise<ClassThreadMessage[]>;
}
