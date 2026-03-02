import { ClassInterface } from "../types";

export const createClassInterface = (classInterface: ClassInterface): ClassInterface => ({
    getMyClassContext: classInterface.getMyClassContext,
    listClassMembers: classInterface.listClassMembers,
    listClassThreads: classInterface.listClassThreads,
    getClassThreadMessages: classInterface.getClassThreadMessages,
    createClass: classInterface.createClass,
    deleteClass: classInterface.deleteClass,
    leaveClass: classInterface.leaveClass,
    joinClassByInviteCode: classInterface.joinClassByInviteCode,
    createGroupThread: classInterface.createGroupThread,
    renameClassThread: classInterface.renameClassThread,
    deleteClassThread: classInterface.deleteClassThread,
    postClassMessage: classInterface.postClassMessage,
});

export const classInstance = createClassInterface();
