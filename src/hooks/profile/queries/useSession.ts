//Session Query
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "./authKeys";
import { authInstance } from "../interface/authInterface";

export const useSessionQuery = () => {
    const queryClient = useQueryClient();

    //Subcribe auth change action from backend and get session when it changes.
    useEffect(() => {
        const unsubscribe = authInstance.onAuthStateChange(
            (session) => {
                queryClient.setQueryData(authKeys.session(), session);
            },
        );

        return () => unsubscribe();
    }, [queryClient]);

    return useQuery({
        queryKey: authKeys.session(),
        queryFn: authInstance.getSession,
        staleTime: Infinity,
    });
};
