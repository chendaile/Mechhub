import { ClassInterface } from "../types";

export const createClassInterface = (classInterface: ClassInterface): ClassInterface => ({
    getMyClass: classInterface.getMyClass,
    getClassMembers: classInterface.getClassMembers,
    getClassThreads: classInterface.getClassThreads,
    getClassThreadMessages: classInterface.getClassThreadMessages,
    createClass: classInterface.createClass,
    deleteClass: classInterface.deleteClass,
    leaveClass: classInterface.leaveClass,
    joinClass: classInterface.joinClass,
    createClassThread: classInterface.createClassThread,
    renameClassThread: classInterface.renameClassThread,
    deleteClassThread: classInterface.deleteClassThread,
    postClassMessage: classInterface.postClassMessage,
});

export const classInstance = createClassInterface();
