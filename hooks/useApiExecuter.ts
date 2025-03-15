import { useState } from "react";
import {
    executeApiRequest,
    modifyCurlCommand,
    type ApiExecutionResult,
} from "@/services/executer";
import { parseCurlCommand, type ParsedCurlCommand } from "@/util/curl-parser";
import { toast } from "sonner";

interface ApiExecutorState {
    isExecuting: boolean;
    result: ApiExecutionResult | null;
    parsedCommand: ParsedCurlCommand | null;
    modifiedCurlCommand: string | null;
    originalCurlCommand: string | null;
}

interface ApiExecutorMethods {
    executeCommand: (curlCommand: string) => Promise<void>;
    updateParams: (params: Record<string, string>) => void;
    updateHeaders: (headers: Record<string, string>) => void;
    updateBody: (body: string) => void;
    resetExecution: () => void;
    resetModifications: () => void;
}

export function useApiExecutor(): ApiExecutorState & ApiExecutorMethods {
    const [state, setState] = useState<ApiExecutorState>({
        isExecuting: false,
        result: null,
        parsedCommand: null,
        modifiedCurlCommand: null,
        originalCurlCommand: null,
    });

    const executeCommand = async (curlCommand: string) => {
        try {
            setState((prev) => ({
                ...prev,
                isExecuting: true,
                originalCurlCommand: curlCommand,
                modifiedCurlCommand: curlCommand,
            }));

            const parsedCommand = parseCurlCommand(curlCommand);

            toast.loading("Executing API request...", {
                id: "api-execution",
                description: `${parsedCommand.method} ${parsedCommand.url}`,
            });

            const result = await executeApiRequest(curlCommand);

            if (result.success) {
                toast.success("API request successful", {
                    id: "api-execution",
                    description: `${result.status} ${result.statusText} (${result.timeMs}ms)`,
                });
            } else {
                toast.error("API request failed", {
                    id: "api-execution",
                    description:
                        result.error || `${result.status} ${result.statusText}`,
                });
            }

            setState((prev) => ({
                ...prev,
                isExecuting: false,
                result,
                parsedCommand,
            }));
        } catch (error) {
            console.error("Error executing API request:", error);

            toast.error("Failed to execute request", {
                id: "api-execution",
                description:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            });

            setState((prev) => ({
                ...prev,
                isExecuting: false,
                result: {
                    status: 0,
                    statusText: "Request Failed",
                    headers: {},
                    body: null,
                    timeMs: 0,
                    error:
                        error instanceof Error ? error.message : String(error),
                    success: false,
                },
            }));
        }
    };

    const updateParams = (params: Record<string, string>) => {
        if (!state.originalCurlCommand || !state.parsedCommand) return;

        const modifiedCommand = modifyCurlCommand(
            state.originalCurlCommand,
            params,
            undefined,
            undefined
        );

        setState((prev) => ({
            ...prev,
            modifiedCurlCommand: modifiedCommand,
        }));
    };

    const updateHeaders = (headers: Record<string, string>) => {
        if (!state.originalCurlCommand || !state.parsedCommand) return;

        const modifiedCommand = modifyCurlCommand(
            state.originalCurlCommand,
            undefined,
            headers,
            undefined
        );

        setState((prev) => ({
            ...prev,
            modifiedCurlCommand: modifiedCommand,
        }));
    };

    const updateBody = (body: string) => {
        if (!state.originalCurlCommand || !state.parsedCommand) return;

        const modifiedCommand = modifyCurlCommand(
            state.originalCurlCommand,
            undefined,
            undefined,
            body
        );

        setState((prev) => ({
            ...prev,
            modifiedCurlCommand: modifiedCommand,
        }));
    };

    const resetExecution = () => {
        setState((prev) => ({
            ...prev,
            result: null,
        }));
    };

    const resetModifications = () => {
        if (!state.originalCurlCommand) return;

        setState((prev) => ({
            ...prev,
            modifiedCurlCommand: prev.originalCurlCommand,
        }));
    };

    return {
        ...state,
        executeCommand,
        updateParams,
        updateHeaders,
        updateBody,
        resetExecution,
        resetModifications,
    };
}

export default useApiExecutor;
