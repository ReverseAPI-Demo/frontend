import { parseCurlCommand } from "@/util/curl-parser";

export interface ApiExecutionResult {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
    timeMs: number;
    error?: string;
    success: boolean;
}

const API_BASE_URL = "http://164.92.92.209:8000/api";

export async function executeApiRequest(
    curlCommand: string
): Promise<ApiExecutionResult> {
    try {
        const parsedCommand = parseCurlCommand(curlCommand);

        const startTime = performance.now();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const requestPayload = {
            url: parsedCommand.url,
            method: parsedCommand.method,
            headers: parsedCommand.headers,
            data: parsedCommand.data,
        };

        const response = await fetch(`${API_BASE_URL}/execute-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestPayload),
        });

        clearTimeout(timeoutId);

        const endTime = performance.now();
        const timeMs = Math.round(endTime - startTime);

        if (!response.ok) {
            let errorMessage = `Error: ${response.status} ${response.statusText}`;

            try {
                const errorData = await response.json();
                if (errorData.detail || errorData.message || errorData.error) {
                    errorMessage =
                        errorData.detail ||
                        errorData.message ||
                        errorData.error;
                }
            } catch (e) {}

            return {
                status: response.status,
                statusText: response.statusText,
                headers: {},
                body: null,
                timeMs,
                error: errorMessage,
                success: false,
            };
        }

        const headers: Record<string, string> = {};
        const responseHeaders = response.headers.get("x-proxied-headers");

        if (responseHeaders) {
            try {
                const parsedHeaders = JSON.parse(responseHeaders);
                Object.assign(headers, parsedHeaders);
            } catch (e) {
                console.error("Error parsing proxied headers:", e);
            }
        }

        let body;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            body = await response.json();
        } else {
            body = await response.text();
        }

        return {
            status: response.status,
            statusText: response.statusText,
            headers,
            body,
            timeMs,
            success: response.ok,
        };
    } catch (error) {
        console.error("Error executing API request:", error);
        return {
            status: 0,
            statusText: "Request Failed",
            headers: {},
            body: null,
            timeMs: 0,
            error: error instanceof Error ? error.message : String(error),
            success: false,
        };
    }
}

export function modifyCurlCommand(
    originalCommand: string,
    updatedParams?: Record<string, string>,
    updatedHeaders?: Record<string, string>,
    updatedBody?: string
): string {
    try {
        const parsedCommand = parseCurlCommand(originalCommand);
        let modifiedCommand = `curl -X ${parsedCommand.method}`;

        let url = parsedCommand.url;
        if (updatedParams) {
            const urlBase = url.split("?")[0];

            const queryString = Object.entries(updatedParams)
                .map(
                    ([key, value]) =>
                        `${encodeURIComponent(key)}=${encodeURIComponent(
                            value
                        )}`
                )
                .join("&");

            url = queryString ? `${urlBase}?${queryString}` : urlBase;
        }

        const headersToUse = updatedHeaders || parsedCommand.headers;
        for (const [key, value] of Object.entries(headersToUse)) {
            modifiedCommand += ` -H "${key}: ${value}"`;
        }

        if (parsedCommand.data || updatedBody) {
            const bodyToUse =
                updatedBody !== undefined ? updatedBody : parsedCommand.data;
            if (bodyToUse) {
                modifiedCommand += ` -d '${bodyToUse}'`;
            }
        }

        modifiedCommand += ` "${url}"`;

        return modifiedCommand;
    } catch (error) {
        console.error("Error modifying curl command:", error);

        return originalCommand;
    }
}
