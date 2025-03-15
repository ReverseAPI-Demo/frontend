import historyService from "@/services/history";
import { useState, useEffect } from "react";
import apiService from "@/services/api";
import { toast } from "sonner";

export interface RequestInfo {
    url: string;
    method: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
    authType?: string;
}

export interface AnalysisResult {
    curlCommand: unknown;
}

export function useHarAnalyzer() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isApiConnected, setIsApiConnected] = useState(true);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        const checkApiConnection = async () => {
            try {
                await apiService.checkHealth();
                setIsApiConnected(true);
            } catch (error) {
                setIsApiConnected(false);
                toast.error("API Connection Error", {
                    description:
                        "Could not connect to the API service. Please try again later.",
                });
                console.error("API health check failed:", error);
            }
        };

        checkApiConnection();
    }, []);

    const analyzeHarFile = async (file: File | null, description: string) => {
        setIsProcessing(true);
        setResult(null);

        const toastId = toast.loading("Analyzing HAR file...", {
            description: "Extracting API request based on your description",
        });

        if (!file) {
            toast.warning("Warning", {
                description: "Please upload a valid file before analyzing.",
            });
            return;
        }

        try {
            const response = await apiService.processHarFile(file, description);

            if (response) {
                setResult({
                    curlCommand: response,
                });

                historyService.addEntry({
                    fileName: file.name,
                    description: description,
                    curlCommand: response,
                    tags: extractTagsFromCommand(response),
                });

                toast.success("Analysis Complete", {
                    id: toastId,
                    description: "Successfully extracted API request",
                });
            } else {
                throw new Error("Failed to process HAR file");
            }
        } catch (error) {
            let errorMessage = "An unexpected error occurred";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Analysis Failed", {
                id: toastId,
                description: errorMessage,
            });

            console.error("HAR analysis error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        analyzeHarFile,
        isProcessing,
        isApiConnected,
        result,
    };
}

const extractTagsFromCommand = (curlCommand: any): string[] => {
    const tags: string[] = [];

    const methodMatch = curlCommand.match(/-X\s+(\w+)/i);
    if (methodMatch) {
        tags.push(methodMatch[1]);
    } else if (curlCommand.includes("-d") || curlCommand.includes("--data")) {
        tags.push("POST");
    } else {
        tags.push("GET");
    }

    if (curlCommand.toLowerCase().includes("authorization")) {
        tags.push("Auth");
    }

    if (curlCommand.toLowerCase().includes("weather")) {
        tags.push("Weather");
    } else if (curlCommand.toLowerCase().includes("recipe")) {
        tags.push("Recipe");
    } else if (curlCommand.toLowerCase().includes("flight")) {
        tags.push("Flight");
    }

    return tags;
};

export default useHarAnalyzer;
