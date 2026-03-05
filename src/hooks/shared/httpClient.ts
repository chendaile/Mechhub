type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE_URL = "http://localhost:31858";

const buildUrl = (path: string) => {
    if (path.startsWith("http")) {
        return path;
    }
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const parseJson = async <T>(response: Response): Promise<T> => {
    const text = await response.text();
    if (!text) {
        return undefined as T;
    }
    return JSON.parse(text) as T;
};

const request = async <T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
): Promise<T> => {
    const response = await fetch(buildUrl(path), {
        method,
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const payload = await response.text();
        throw new Error(payload || `Request failed: ${response.status}`);
    }

    return parseJson<T>(response);
};

const requestForm = async <T>(
    method: HttpMethod,
    path: string,
    formData: FormData,
): Promise<T> => {
    const response = await fetch(buildUrl(path), {
        method,
        body: formData,
    });

    if (!response.ok) {
        const payload = await response.text();
        throw new Error(payload || `Request failed: ${response.status}`);
    }

    return parseJson<T>(response);
};

export const httpClient = {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
    put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
    patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
    del: <T>(path: string) => request<T>("DELETE", path),
    postForm: <T>(path: string, formData: FormData) =>
        requestForm<T>("POST", path, formData),
    putForm: <T>(path: string, formData: FormData) => requestForm<T>("PUT", path, formData),
};
