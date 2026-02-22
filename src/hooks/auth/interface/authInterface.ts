//Auth Interface
import { SupabaseAuthInstance } from "../implementation/supabaseAuthInstance";
import type { AuthInterface } from "../types";

//Pass in an instance class
const createAuthInstance = (
    authInterface: AuthInterface,
): AuthInterface => ({
    signIn: authInterface.signIn,
    signUp: authInterface.signUp,
    signOut: authInterface.signOut,
});

export const authInstance = createAuthInstance(SupabaseAuthInstance);
