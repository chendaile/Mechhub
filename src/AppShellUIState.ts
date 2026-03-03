import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    assignmentInstance,
    assignmentKeys,
    CreateAssignmentMutation,
    GenerateGradeDraftMutation,
    ReleaseGradeMutation,
    SaveGradeReviewMutation,
    StudentAssignmentsQuery,
    StudentFeedbackQuery,
    SubmitAssignmentFromChatMutation,
    type Assignment,
    type CreateAssignmentPayload,
    type SaveGradeReviewPayload,
} from "./hooks/assignment";
import { authInstance, clearSession, useAuthShowState, useSessionQuery } from "./hooks/auth/export";
import { getPermission } from "./hooks/authz/export";
import { useProfileQuery } from "./hooks/profile/queries/useProfile";
import {
    chatUseCases,
    chatKeys,
    chatShareInterface,
    upsertSavedChatSession,
    ChatRuntimeUIState,
    ChatSessionsUIState,
} from "./hooks/chat";
import { CreateGroupThreadMutation, DeleteClassMutation, DeleteClassThreadMutation, LeaveClassMutation, RenameClassThreadMutation } from "./hooks/class/queries/ClassMutationHooks";
import { ClassThreadsBatchQuery, MyClassContextQuery } from "./hooks/class/queries/ClassQueryHooks";
import { classKeys } from "./hooks/class/queries/classKeys";
import { ActiveChatTargetUIState } from "./ActiveChatTargetUIState";
import { SelectedClassUIState } from "./hooks/class/ui/SelectedClassUIState";
import { AppShareFlow } from "./AppShareFlow";
import { AppView } from "./AppView";
import { PublishAssignmentCreationFlow } from "./hooks/assignment/ui/PublishAssignmentCreationFlow";
import type { ActiveView } from "./views/shared/types";
import {
    APP_CLASS_MEMBERSHIP_NOTICES,
    APP_FALLBACK_USER_PROFILE,
    buildSharePickerDescription,
    createClassOptions,
    type AppShellEnterClassChatPayload,
    type AppShellViewAccess,
} from "./appShellModel";
import { canAccessView, resolveFallbackView } from "./viewAccess";

type SubmitToAssignmentIntent =
    | {
          kind: "chatSession";
          chatId: string;
      }
    | {
          kind: "chatMessage";
          chatId: string;
          messageId: string;
      };

export const AppShellUIState = () => {
    const queryClient = useQueryClient();
    const [creatingClassThreadId, setCreatingClassThreadId] = useState<string | null>(null);

    const [submitToAssignmentIntent, setSubmitToAssignmentIntent] =
        useState<SubmitToAssignmentIntent | null>(null);

    const [generatingGradeDraftIds, setGeneratingGradeDraftIds] = useState<Set<string>>(new Set());

    const previousViewerUserIdRef = useRef<string | null | undefined>(undefined);

    const { data: session, isLoading: loading } = useSessionQuery();
    const { data: userProfile } = useProfileQuery();
    const { showAuth, setShowAuth } = useAuthShowState();

    const handleSignOut = useCallback(async () => {
        await authInstance.signOut();
        clearSession();
    }, []);
    const viewerUserId = session?.userId ?? null;

    const safeUserProfile = userProfile
        ? {
              name: userProfile.name ?? APP_FALLBACK_USER_PROFILE.name,
              avatar: userProfile.avatarUrl ?? APP_FALLBACK_USER_PROFILE.avatar,
          }
        : APP_FALLBACK_USER_PROFILE;

    const authorization = getPermission();
    const isAuthorizationLoading = false;
    const isAuthorizationFetching = false;

    const classContextQuery = MyClassContextQuery();
    const classContext = classContextQuery?.data;
    const isClassContextLoading = classContextQuery?.isLoading ?? false;

    const canAccessChat = authorization["chat.access"] === "allow";
    const canAccessProfile = authorization["profile.access"] === "allow";

    const canAccessStudentAssignments = authorization["assignment.student.access"] === "allow";

    const canAccessTeacherAssignments = authorization["assignment.teacher.access"] === "allow";

    const canAccessClassHub = canAccessStudentAssignments || canAccessTeacherAssignments;

    const viewAccess = useMemo<AppShellViewAccess>(
        () => ({
            canAccessChat,
            canAccessProfile,
            canAccessClassHub,
            canAccessStudentAssignments,
            canAccessTeacherAssignments,
        }),
        [
            canAccessChat,
            canAccessProfile,
            canAccessClassHub,
            canAccessStudentAssignments,
            canAccessTeacherAssignments,
        ],
    );

    const teachingClasses = classContext?.teachingClasses ?? [];
    const joinedClasses = classContext?.joinedClasses ?? [];
    const classOptions = useMemo(
        () => createClassOptions(teachingClasses, joinedClasses),
        [teachingClasses, joinedClasses],
    );

    const selectedClassState = SelectedClassUIState(classOptions);
    const selectedClassId = selectedClassState.state.selectedClassId;
    const selectedClass = useMemo(
        () => classOptions.find((classItem) => classItem.id === selectedClassId),
        [classOptions, selectedClassId],
    );
    const hasStudentClassMembership = joinedClasses.length > 0;
    const hasTeacherClassMembership = teachingClasses.length > 0;
    const classThreadsBatchQuery = ClassThreadsBatchQuery(
        classOptions.map((classItem) => classItem.id),
        !!session && canAccessClassHub,
    );

    const classSessionGroups = useMemo(
        () =>
            classOptions.map((classItem) => {
                const threadRows = classThreadsBatchQuery.dataByClassId[classItem.id] ?? [];

                const threads = threadRows.map((thread) => ({
                    id: thread.id,
                    classId: classItem.id,
                    title: thread.title,
                }));

                return {
                    classId: classItem.id,
                    className: classItem.name,
                    role: classItem.role,
                    threads,
                };
            }),
        [classOptions, classThreadsBatchQuery.dataByClassId],
    );

    const {
        chatSessions,
        isLoadingSessions,
        currentSessionId,
        chatMode,
        setChatMode,
        deleteChatSession,
        handleSelectSession,
        handleStartNewQuest,
        handleClearCurrentSessionSelection,
        handleRenameSession,
        messages,
        setCurrentSessionId,
    } = ChatSessionsUIState(session, canAccessChat);

    const { isTyping, handleSendMessage, handleStopGeneration } = ChatRuntimeUIState({
        currentSessionId,
        setCurrentSessionId,
    });

    const guardedSendMessage = canAccessChat ? handleSendMessage : () => undefined;

    const { activeView, setActiveView, onSendMessage, onStartChat } = AppView({
        handleSendMessage: guardedSendMessage,
    });

    const isSubmitAssignmentView = activeView === "submitAssignment";
    const isViewFeedbackView = activeView === "viewFeedback";
    const myAssignmentsQuery = StudentAssignmentsQuery(
        undefined,
        !!session && canAccessStudentAssignments,
        isSubmitAssignmentView
            ? {
                  staleTime: 5_000,
                  refetchInterval: 10_000,
                  refetchOnMount: "always",
              }
            : undefined,
    );

    const myFeedbackQuery = StudentFeedbackQuery(
        undefined,
        !!session && canAccessStudentAssignments,
        isViewFeedbackView
            ? {
                  staleTime: 5_000,
                  refetchInterval: 10_000,
                  refetchOnMount: "always",
              }
            : undefined,
    );

    const fallbackView = useMemo(() => resolveFallbackView(viewAccess), [viewAccess]);

    useEffect(() => {
        if (!session) {
            return;
        }

        if (!canAccessView(activeView, viewAccess)) {
            setActiveView(fallbackView);
        }
    }, [activeView, fallbackView, session, setActiveView, viewAccess]);

    useEffect(() => {
        if (activeView !== "submitAssignment") {
            return;
        }
        void myAssignmentsQuery.refetch();
    }, [activeView, myAssignmentsQuery.refetch]);

    useEffect(() => {
        if (activeView !== "viewFeedback") {
            return;
        }
        void myFeedbackQuery.refetch();
    }, [activeView, myFeedbackQuery.refetch]);

    const guardedSetActiveView = useCallback(
        (view: ActiveView) => {
            setActiveView(canAccessView(view, viewAccess) ? view : fallbackView);
        },
        [fallbackView, setActiveView, viewAccess],
    );

    const activeChatTargetState = ActiveChatTargetUIState();

    const safeChatSessions = canAccessChat ? chatSessions : [];
    const safeCurrentSessionId = canAccessChat ? currentSessionId : null;
    const safeMessages = canAccessChat ? messages : [];
    const safeIsLoadingSessions = canAccessChat ? isLoadingSessions : false;
    const safeIsTyping = canAccessChat ? isTyping : false;
    const safeSetChatMode = canAccessChat ? setChatMode : () => undefined;

    const safeOnSendMessage = canAccessChat
        ? (payload: Parameters<typeof onSendMessage>[0]) => {
              activeChatTargetState.actions.setPrivateChatTarget();
              onSendMessage(payload);
          }
        : () => undefined;

    const safeOnStartChat = canAccessChat
        ? (
              message?: string,
              imageUrls?: string[],
              fileAttachments?: Parameters<typeof onStartChat>[2],
              model?: string,
              mode?: Parameters<typeof onStartChat>[4],
          ) => {
              activeChatTargetState.actions.setPrivateChatTarget();
              onStartChat(message, imageUrls, fileAttachments, model, mode);
          }
        : () => undefined;

    const safeHandleStopGeneration = canAccessChat ? handleStopGeneration : () => undefined;

    const safeDeleteChatSession = canAccessChat
        ? deleteChatSession
        : async () => ({ success: false, wasCurrentSession: false });

    const safeHandleSelectSession = canAccessChat
        ? (id: string) => {
              activeChatTargetState.actions.setPrivateChatTarget();

              return handleSelectSession(id);
          }
        : () => false;

    const safeHandleStartNewQuest = canAccessChat
        ? () => {
              activeChatTargetState.actions.setPrivateChatTarget();
              handleStartNewQuest();
          }
        : () => undefined;

    const safeHandleRenameSession = canAccessChat ? handleRenameSession : async () => false;

    const {
        shareIntent,
        setShareIntent,
        handleShareChatMessageToClass,
        handleShareChatSessionToClass,
        handleConfirmThreadShare,
        isSharing,
    } = AppShareFlow({
        classThreadGroups: classSessionGroups,
        currentSessionId: safeCurrentSessionId,
    });

    useEffect(() => {
        const previousViewerUserId = previousViewerUserIdRef.current;
        if (previousViewerUserId === undefined) {
            previousViewerUserIdRef.current = viewerUserId;

            return;
        }

        if (previousViewerUserId === viewerUserId) {
            return;
        }

        handleStopGeneration();
        setShareIntent(null);
        setSubmitToAssignmentIntent(null);
        handleClearCurrentSessionSelection();
        activeChatTargetState.actions.setPrivateChatTarget();
        selectedClassState.actions.setSelectedClassId(null);
        setChatMode("study");
        guardedSetActiveView("home");

        if (previousViewerUserId) {
            void (async () => {
                await Promise.all([
                    queryClient.cancelQueries({
                        queryKey: chatKeys.all(previousViewerUserId),
                    }),
                    queryClient.cancelQueries({
                        queryKey: classKeys.all(previousViewerUserId),
                    }),
                    queryClient.cancelQueries({
                        queryKey: assignmentKeys.viewer(previousViewerUserId),
                    }),
                ]);

                queryClient.removeQueries({
                    queryKey: chatKeys.all(previousViewerUserId),
                });
                queryClient.removeQueries({
                    queryKey: classKeys.all(previousViewerUserId),
                });
                queryClient.removeQueries({
                    queryKey: assignmentKeys.viewer(previousViewerUserId),
                });
            })();
        }

        previousViewerUserIdRef.current = viewerUserId;
    }, [
        activeChatTargetState.actions,
        guardedSetActiveView,
        handleClearCurrentSessionSelection,
        handleStopGeneration,
        queryClient,
        selectedClassState.actions,
        setChatMode,
        setShareIntent,
        setSubmitToAssignmentIntent,
        viewerUserId,
    ]);

    const createGroupThreadMutation = CreateGroupThreadMutation();
    const deleteClassMutation = DeleteClassMutation();
    const leaveClassMutation = LeaveClassMutation();
    const renameClassThreadMutation = RenameClassThreadMutation();
    const deleteClassThreadMutation = DeleteClassThreadMutation();
    const createAssignmentMutation = CreateAssignmentMutation();
    const submitAssignmentFromChatMutation = SubmitAssignmentFromChatMutation();

    const generateGradeDraftMutation = GenerateGradeDraftMutation();
    const saveGradeReviewMutation = SaveGradeReviewMutation();
    const releaseGradeMutation = ReleaseGradeMutation();

    const getClassNameById = useCallback(
        (classId: string) =>
            classOptions.find((classItem) => classItem.id === classId)?.name ?? classId,
        [classOptions],
    );

    const handleEnterClassChat = useCallback(
        (payload: AppShellEnterClassChatPayload) => {
            const className = payload.className ?? getClassNameById(payload.classId);

            handleClearCurrentSessionSelection();
            selectedClassState.actions.setSelectedClassId(payload.classId);
            activeChatTargetState.actions.setClassChatTarget({
                classId: payload.classId,
                className,
                threadId: payload.threadId,
                threadTitle: payload.threadTitle,
                currentUserId: session?.userId ?? "",
            });
            guardedSetActiveView("chat");
        },
        [
            activeChatTargetState.actions,
            getClassNameById,
            guardedSetActiveView,
            handleClearCurrentSessionSelection,
            selectedClassState.actions,
            session?.userId,
        ],
    );

    const handleSelectClassThread = useCallback(
        (thread: { classId: string; id: string; title: string }) => {
            handleEnterClassChat({
                classId: thread.classId,
                threadId: thread.id,
                threadTitle: thread.title,
            });
        },
        [handleEnterClassChat],
    );

    const handleCreateClassThread = useCallback(
        async (classId: string) => {
            try {
                setCreatingClassThreadId(classId);
                const thread = await createGroupThreadMutation.mutateAsync({
                    classId,
                    title: "班级讨论",
                });

                handleEnterClassChat({
                    classId,
                    threadId: thread.id,
                    threadTitle: thread.title,
                });
            } catch {
            } finally {
                setCreatingClassThreadId(null);
            }
        },
        [createGroupThreadMutation, handleEnterClassChat],
    );

    const handleRenameClassThread = useCallback(
        async (classId: string, threadId: string, title: string) => {
            const nextTitle = title.trim();
            if (!nextTitle) {
                toast.error("请输入有效的话题名称");

                return false;
            }

            if (nextTitle.length > 60) {
                toast.error("话题名称最多 60 个字符");

                return false;
            }

            try {
                const thread = await renameClassThreadMutation.mutateAsync({
                    classId,
                    threadId,
                    title: nextTitle,
                });

                const currentClassTarget = activeChatTargetState.state.classChatTarget;
                if (currentClassTarget?.threadId === threadId) {
                    activeChatTargetState.actions.setClassChatTarget({
                        ...currentClassTarget,
                        threadTitle: thread.title,
                    });
                }

                return true;
            } catch {
                return false;
            }
        },
        [
            activeChatTargetState.actions,
            activeChatTargetState.state.classChatTarget,
            renameClassThreadMutation,
        ],
    );

    const handleDeleteClassThread = useCallback(
        async (classId: string, threadId: string) => {
            try {
                const result = await deleteClassThreadMutation.mutateAsync({
                    classId,
                    threadId,
                });

                const currentClassTarget = activeChatTargetState.state.classChatTarget;
                if (currentClassTarget?.threadId === threadId) {
                    activeChatTargetState.actions.setPrivateChatTarget();
                    selectedClassState.actions.setSelectedClassId(classId);
                    guardedSetActiveView("classHub");
                }

                return result.success;
            } catch {
                return false;
            }
        },
        [
            activeChatTargetState.actions,
            activeChatTargetState.state.classChatTarget,
            deleteClassThreadMutation,
            guardedSetActiveView,
            selectedClassState.actions,
        ],
    );

    const handleDeleteClass = useCallback(
        async (classId: string) => {
            try {
                await deleteClassMutation.mutateAsync(classId);

                const currentClassTarget = activeChatTargetState.state.classChatTarget;
                if (currentClassTarget?.classId === classId) {
                    activeChatTargetState.actions.setPrivateChatTarget();
                }

                selectedClassState.actions.setSelectedClassId(null);
                guardedSetActiveView("classHub");

                return true;
            } catch {
                return false;
            }
        },
        [
            activeChatTargetState.actions,
            activeChatTargetState.state.classChatTarget,
            deleteClassMutation,
            guardedSetActiveView,
            selectedClassState.actions,
        ],
    );

    const handleLeaveClass = useCallback(
        async (classId: string) => {
            try {
                await leaveClassMutation.mutateAsync(classId);

                const currentClassTarget = activeChatTargetState.state.classChatTarget;
                if (currentClassTarget?.classId === classId) {
                    activeChatTargetState.actions.setPrivateChatTarget();
                }

                selectedClassState.actions.setSelectedClassId(null);
                guardedSetActiveView("classHub");

                if (viewerUserId) {
                    await queryClient.invalidateQueries({
                        queryKey: assignmentKeys.viewer(viewerUserId),
                    });
                }

                return true;
            } catch {
                return false;
            }
        },
        [
            activeChatTargetState.actions,
            activeChatTargetState.state.classChatTarget,
            guardedSetActiveView,
            leaveClassMutation,
            queryClient,
            selectedClassState.actions,
            viewerUserId,
        ],
    );

    const handleCopySharedClassMessageToNewSession = useCallback(
        async (content: Record<string, unknown>) => {
            if (!canAccessChat) {
                toast.error("Chat access is required.");

                return;
            }

            try {
                const savedSession =
                    await chatShareInterface.copySharedClassMessageToNewSession(content);

                upsertSavedChatSession(queryClient, viewerUserId, savedSession);
                await queryClient.invalidateQueries({
                    queryKey: chatKeys.lists(viewerUserId),
                    refetchType: "inactive",
                });

                setCurrentSessionId(savedSession.id);
                activeChatTargetState.actions.setPrivateChatTarget();
                guardedSetActiveView("chat");
                toast.success("已复制到你的新会话");
            } catch (error) {
                const message = error instanceof Error ? error.message : "复制失败";
                toast.error(message);
            }
        },
        [
            activeChatTargetState.actions,
            canAccessChat,
            guardedSetActiveView,
            queryClient,
            setCurrentSessionId,
            viewerUserId,
        ],
    );

    const classIdSet = useMemo(
        () => new Set(classOptions.map((classItem) => classItem.id)),
        [classOptions],
    );

    const studentAssignments = useMemo(() => {
        const assignments = myAssignmentsQuery.data ?? [];
        if (classIdSet.size === 0) {
            return [];
        }

        return assignments.filter((assignment) => classIdSet.has(assignment.classId));
    }, [classIdSet, myAssignmentsQuery.data]);

    const feedbackSummaries = useMemo(() => {
        const feedback = myFeedbackQuery.data ?? [];
        if (classIdSet.size === 0) {
            return [];
        }

        return feedback.filter((item) => {
            const classId = item.assignment?.classId || item.submission.classId;

            return classIdSet.has(classId);
        });
    }, [classIdSet, myFeedbackQuery.data]);

    const assignmentById = useMemo(
        () =>
            studentAssignments.reduce<Map<string, Assignment>>((map, item) => {
                map.set(item.id, item);

                return map;
            }, new Map<string, Assignment>()),
        [studentAssignments],
    );

    const submitTargetAssignments = useMemo(
        () => studentAssignments.filter((assignment) => assignment.status !== "closed"),
        [studentAssignments],
    );

    const handleSubmitChatSessionToAssignment = useCallback(
        (sessionId: string) => {
            if (!canAccessStudentAssignments) {
                toast.error("需要学生作业权限。");

                return;
            }

            if (!sessionId) {
                toast.error("请先打开一个私聊会话。");

                return;
            }

            if (submitTargetAssignments.length === 0) {
                toast.error("当前没有可提交的作业。");

                return;
            }

            setSubmitToAssignmentIntent({
                kind: "chatSession",
                chatId: sessionId,
            });
        },
        [canAccessStudentAssignments, submitTargetAssignments.length],
    );

    const handleSubmitChatMessageToAssignment = useCallback(
        (messageId: string) => {
            if (!canAccessStudentAssignments) {
                toast.error("需要学生作业权限。");

                return;
            }

            if (!safeCurrentSessionId) {
                toast.error("请先打开一个私聊会话。");

                return;
            }

            if (submitTargetAssignments.length === 0) {
                toast.error("当前没有可提交的作业。");

                return;
            }

            setSubmitToAssignmentIntent({
                kind: "chatMessage",
                chatId: safeCurrentSessionId,
                messageId,
            });
        },
        [canAccessStudentAssignments, safeCurrentSessionId, submitTargetAssignments.length],
    );

    const handleConfirmSubmitToAssignment = useCallback(
        async (assignmentId: string, reflectionText: string) => {
            const assignment = assignmentById.get(assignmentId);
            if (!assignment) {
                toast.error("未找到作业。");

                return false;
            }

            if (!submitToAssignmentIntent) {
                toast.error("请选择聊天提交来源。");

                return false;
            }

            try {
                await submitAssignmentFromChatMutation.mutateAsync({
                    assignmentId,
                    classId: assignment.classId,
                    sourceKind:
                        submitToAssignmentIntent.kind === "chatSession"
                            ? "chat_session_snapshot"
                            : "chat_response_snapshot",
                    sourceChatId: submitToAssignmentIntent.chatId,
                    sourceMessageId:
                        submitToAssignmentIntent.kind === "chatMessage"
                            ? submitToAssignmentIntent.messageId
                            : undefined,
                    reflectionText: reflectionText.trim(),
                });

                setSubmitToAssignmentIntent(null);

                return true;
            } catch {
                return false;
            }
        },
        [assignmentById, submitAssignmentFromChatMutation, submitToAssignmentIntent],
    );

    const handleSubmitCurrentSessionToAssignment = useCallback(
        async (assignmentId: string, reflectionText = "") => {
            if (!safeCurrentSessionId) {
                toast.error("请先打开一个私聊会话。");

                return false;
            }

            const assignment = assignmentById.get(assignmentId);
            if (!assignment) {
                toast.error("未找到作业。");

                return false;
            }

            try {
                await submitAssignmentFromChatMutation.mutateAsync({
                    assignmentId,
                    classId: assignment.classId,
                    sourceKind: "chat_session_snapshot",
                    sourceChatId: safeCurrentSessionId,
                    reflectionText: reflectionText.trim(),
                });

                return true;
            } catch {
                return false;
            }
        },
        [assignmentById, safeCurrentSessionId, submitAssignmentFromChatMutation],
    );

    const handleCreateAssignment = useCallback(
        async (payload: CreateAssignmentPayload) => {
            try {
                await createAssignmentMutation.mutateAsync(payload);

                return true;
            } catch {
                return false;
            }
        },
        [createAssignmentMutation],
    );

    const { handlePublishAssignment } = PublishAssignmentCreationFlow({
        classOptions,
        onCreateAssignment: handleCreateAssignment,
        onPublished: () => guardedSetActiveView("gradeAssignment"),
    });

    const handleGenerateGradeDraft = useCallback(
        async (submissionId: string, model?: string, options?: { silent?: boolean }) => {
            setGeneratingGradeDraftIds((previous) => {
                const next = new Set(previous);
                next.add(submissionId);

                return next;
            });
            if (!options?.silent) {
                try {
                    await generateGradeDraftMutation.mutateAsync({
                        submissionId,
                        model,
                    });

                    return true;
                } catch {
                    return false;
                } finally {
                    setGeneratingGradeDraftIds((previous) => {
                        const next = new Set(previous);
                        next.delete(submissionId);

                        return next;
                    });
                }
            }

            try {
                const result = await assignmentInstance.generateGradeDraft({
                    submissionId,
                    model,
                });

                const resolvedSubmissionId = result.submissionId || submissionId;

                if (viewerUserId) {
                    await Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: assignmentKeys.teacherSubmissionsRoot(viewerUserId),
                        }),
                        queryClient.invalidateQueries({
                            queryKey: assignmentKeys.teacherFeedbackRoot(viewerUserId),
                        }),
                    ]);
                }

                return true;
            } catch {
                return false;
            } finally {
                setGeneratingGradeDraftIds((previous) => {
                    const next = new Set(previous);
                    next.delete(submissionId);

                    return next;
                });
            }
        },
        [generateGradeDraftMutation, queryClient, viewerUserId],
    );

    const handleSaveGradeReview = useCallback(
        async (payload: SaveGradeReviewPayload) => {
            try {
                await saveGradeReviewMutation.mutateAsync(payload);

                return true;
            } catch {
                return false;
            }
        },
        [saveGradeReviewMutation],
    );

    const handleReleaseGrade = useCallback(
        async (submissionId: string) => {
            try {
                await releaseGradeMutation.mutateAsync({
                    submissionId,
                });

                return true;
            } catch {
                return false;
            }
        },
        [releaseGradeMutation],
    );

    const classChatTarget = activeChatTargetState.state.classChatTarget;

    const activeClassThreadId = activeChatTargetState.state.activeClassThreadId;

    const chatTargetType = activeChatTargetState.state.activeChatTarget.type;

    const shareableThreadGroups = useMemo(() => classSessionGroups, [classSessionGroups]);

    const sharePickerDescription = buildSharePickerDescription(shareIntent);

    const isAppLoading =
        loading ||
        (session && (isAuthorizationLoading || isAuthorizationFetching || isClassContextLoading));

    return {
        state: {
            session,
            showAuth,
            activeView,
            selectedClassId,
            activeChatTarget: activeChatTargetState.state.activeChatTarget,
            shareIntent,
            submitToAssignmentIntent,
            chatMode,
        },
        actions: {
            setShowAuth,
            setActiveView: guardedSetActiveView,
            setSelectedClassId: selectedClassState.actions.setSelectedClassId,
            setShareIntent,
            setSubmitToAssignmentIntent,
            handleSignOut,
            onSendMessage: safeOnSendMessage,
            onStartChat: safeOnStartChat,
            setChatMode: safeSetChatMode,
            handleStopGeneration: safeHandleStopGeneration,
            deleteChatSession: safeDeleteChatSession,
            handleSelectSession: safeHandleSelectSession,
            handleStartNewQuest: safeHandleStartNewQuest,
            handleRenameSession: safeHandleRenameSession,
            handleSelectClassThread,
            handleCreateClassThread,
            handleRenameClassThread,
            handleDeleteClassThread,
            handleDeleteClass,
            handleLeaveClass,
            handleEnterClassChat,
            handleShareChatMessageToClass,
            handleShareChatSessionToClass,
            handleConfirmThreadShare,
            handleCopySharedClassMessageToNewSession,
            handleSubmitChatSessionToAssignment,
            handleSubmitChatMessageToAssignment,
            handleConfirmSubmitToAssignment,
            handleSubmitCurrentSessionToAssignment,
            handleCreateAssignment,
            handlePublishAssignment,
            handleGenerateGradeDraft,
            handleSaveGradeReview,
            handleReleaseGrade,
        },
        derived: {
            safeUserProfile,
            permissions: viewAccess,
            fallbackView,
            classOptions,
            teacherClassOptions: classOptions
                .filter((classItem) => classItem.role === "teacher")
                .map((classItem) => ({
                    id: classItem.id,
                    name: classItem.name,
                    studentCount: 0,
                    teacherCount: 0,
                })),
            selectedClass,
            classSessionGroups,
            hasStudentClassMembership,
            hasTeacherClassMembership,
            isClassAdmin: selectedClass?.role === "teacher",
            chatSessions: safeChatSessions,
            currentSessionId: safeCurrentSessionId,
            messages: safeMessages,
            isLoadingSessions: safeIsLoadingSessions,
            isTyping: safeIsTyping,
            uploadImage: chatUseCases.storagePort.uploadImage,
            chatTargetType,
            classChatTarget,
            activeClassThreadId,
            sharePickerDescription,
            shareableThreadGroups,
            studentAssignments,
            feedbackSummaries,
            submitTargetAssignments,
            generatingGradeDraftIds,
            classHubProps: {
                requesterEmail: session?.email,
                canCreateClass: canAccessTeacherAssignments,
                canJoinClass: canAccessStudentAssignments || canAccessTeacherAssignments,
                selectedClassId,
                onSelectedClassIdChange: selectedClassState.actions.setSelectedClassId,
                onEnterClassChat: handleEnterClassChat,
            },
            classMembershipNotices: APP_CLASS_MEMBERSHIP_NOTICES,
        },
        meta: {
            isAppLoading,
            loading,
            isAuthorizationLoading,
            isAuthorizationFetching,
            isClassContextLoading,
            isSharing,
            creatingClassThreadId,
            isSubmittingAssignment: submitAssignmentFromChatMutation.isPending,
            isCreatingAssignment: createAssignmentMutation.isPending,
            isGeneratingGradeDraft: generateGradeDraftMutation.isPending,
            isSavingGradeReview: saveGradeReviewMutation.isPending,
            isReleasingGrade: releaseGradeMutation.isPending,
            isLoadingStudentAssignments: myAssignmentsQuery.isLoading,
            isLoadingFeedbackSummaries: myFeedbackQuery.isLoading,
        },
    };
};
