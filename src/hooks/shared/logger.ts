type Logger = {
    info: (message: string, meta?: unknown) => void;
    warn: (message: string, meta?: unknown) => void;
    error: (message: string, meta?: unknown) => void;
};

export const getHooksLogger = (): Logger => {
    return {
        info: (message, meta) => {
            console.info(`[hooks] ${message}`, meta ?? "");
        },
        warn: (message, meta) => {
            console.warn(`[hooks] ${message}`, meta ?? "");
        },
        error: (message, meta) => {
            console.error(`[hooks] ${message}`, meta ?? "");
        },
    };
};
