export interface HealthCheckResponse {
    status: string;
    message: string;
    version?: string;
}

export interface ProcessHarResponse {
    curl_command: string;
    request_info?: {
        url: string;
        method: string;
        headers?: Record<string, string>;
        params?: Record<string, string>;
        auth_type?: string;
    };
    success: boolean;
    error?: string;
}

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const API_BASE_URL = "http://164.92.92.209:8000/api";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorMessage = `Error: ${response.status} ${response.statusText}`;

        try {
            const contentType = response.headers.get("Content-Type");
            if (contentType?.includes("application/json")) {
                const errorData = await response.json();
                if (errorData.detail || errorData.message || errorData.error) {
                    errorMessage =
                        errorData.detail ||
                        errorData.message ||
                        errorData.error;
                }
            } else {
                errorMessage = await response.text();
            }
        } catch (e) {
            console.error("Error occurred while parsing error response:", e);
        }

        throw new ApiError(errorMessage, response.status);
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
        return (await response.json()) as T;
    } else {
        return (await response.text()) as T;
    }
}

export const apiService = {
    async checkHealth(): Promise<HealthCheckResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            console.log(response);
            return handleResponse<HealthCheckResponse>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                "Failed to check API health. Please try again later.",
                500
            );
        }
    },

    async processHarFile(
        file: File,
        apiDescription: string
    ): Promise<ProcessHarResponse> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_description", apiDescription);

            const response = await fetch(`${API_BASE_URL}/process-har`, {
                method: "POST",
                body: formData,
            });

            return handleResponse<ProcessHarResponse>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError("Failed to process!", 500);
        }
    },
};

export function useApiHealthCheck() {
    return {
        checkConnection: async () => {
            try {
                await apiService.checkHealth();
                return true;
            } catch (error) {
                console.error("API health check failed:", error);
                return false;
            }
        },
    };
}

export default apiService;
