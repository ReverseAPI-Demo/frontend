"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    Clock,
    X,
    Code,
    FileJson,
    RefreshCcw,
    Edit3,
    Download,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useApiExecutor } from "@/hooks/useApiExecuter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ApiExecutorProps {
    curlCommand: string;
}

export function ApiExecutor({ curlCommand }: ApiExecutorProps) {
    const {
        isExecuting,
        result,
        parsedCommand,
        modifiedCurlCommand,
        originalCurlCommand,
        executeCommand,
        updateParams,
        updateHeaders,
        updateBody,
        resetExecution,
        resetModifications,
    } = useApiExecutor();

    const [activeTab, setActiveTab] = useState("response");
    const [isEditingParams, setIsEditingParams] = useState(false);
    const [isEditingHeaders, setIsEditingHeaders] = useState(false);
    const [isEditingBody, setIsEditingBody] = useState(false);

    const [editableParams, setEditableParams] = useState<
        Record<string, string>
    >({});
    const [editableHeaders, setEditableHeaders] = useState<
        Record<string, string>
    >({});
    const [editableBody, setEditableBody] = useState("");

    const handleExecute = async () => {
        await executeCommand(modifiedCurlCommand || curlCommand);
        setActiveTab("response");
    };

    const handleDownloadResponse = () => {
        if (!result || !result.body) return;

        try {
            const blob = new Blob(
                [
                    typeof result.body === "string"
                        ? result.body
                        : JSON.stringify(result.body, null, 2),
                ],
                { type: "application/json" }
            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "api-response.json";
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success("Response downloaded successfully");
        } catch (error) {
            console.error("Error downloading response:", error);
            toast.error("Failed to download response");
        }
    };

    const startEditingParams = () => {
        if (!parsedCommand) return;
        setEditableParams({ ...parsedCommand.queryParams });
        setIsEditingParams(true);
    };

    const startEditingHeaders = () => {
        if (!parsedCommand) return;
        setEditableHeaders({ ...parsedCommand.headers });
        setIsEditingHeaders(true);
    };

    const startEditingBody = () => {
        if (!parsedCommand) return;
        setEditableBody(parsedCommand.data || "");
        setIsEditingBody(true);
    };

    const saveParams = () => {
        updateParams(editableParams);
        setIsEditingParams(false);
    };

    const saveHeaders = () => {
        updateHeaders(editableHeaders);
        setIsEditingHeaders(false);
    };

    const saveBody = () => {
        updateBody(editableBody);
        setIsEditingBody(false);
    };

    const cancelEditing = () => {
        setIsEditingParams(false);
        setIsEditingHeaders(false);
        setIsEditingBody(false);
    };

    const addParamRow = () => {
        setEditableParams((prev) => ({ ...prev, "": "" }));
    };

    const addHeaderRow = () => {
        setEditableHeaders((prev) => ({ ...prev, "": "" }));
    };

    const updateParamKey = (oldKey: string, newKey: string) => {
        const newParams = { ...editableParams };
        const value = newParams[oldKey];
        delete newParams[oldKey];
        newParams[newKey] = value;
        setEditableParams(newParams);
    };

    const updateParamValue = (key: string, value: string) => {
        setEditableParams((prev) => ({ ...prev, [key]: value }));
    };

    const updateHeaderKey = (oldKey: string, newKey: string) => {
        const newHeaders = { ...editableHeaders };
        const value = newHeaders[oldKey];
        delete newHeaders[oldKey];
        newHeaders[newKey] = value;
        setEditableHeaders(newHeaders);
    };

    const updateHeaderValue = (key: string, value: string) => {
        setEditableHeaders((prev) => ({ ...prev, [key]: value }));
    };

    const removeParam = (key: string) => {
        const newParams = { ...editableParams };
        delete newParams[key];
        setEditableParams(newParams);
    };

    const removeHeader = (key: string) => {
        const newHeaders = { ...editableHeaders };
        delete newHeaders[key];
        setEditableHeaders(newHeaders);
    };

    const formatJson = (data: any): string => {
        try {
            if (typeof data === "string") {
                try {
                    const parsed = JSON.parse(data);
                    return JSON.stringify(parsed, null, 2);
                } catch {
                    return data;
                }
            }
            return JSON.stringify(data, null, 2);
        } catch (e) {
            return String(data);
        }
    };

    const getContentType = (): string => {
        if (!result) return "text";

        const contentTypeHeader = Object.entries(result.headers).find(
            ([key]) => key.toLowerCase() === "content-type"
        );

        if (!contentTypeHeader) return "text";

        const contentType = contentTypeHeader[1].toLowerCase();
        if (contentType.includes("json")) return "json";
        if (contentType.includes("html")) return "html";
        if (contentType.includes("xml")) return "xml";

        return "text";
    };

    return (
        <Card className="mt-6">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle>Test API Request</CardTitle>
                    <div className="flex items-center gap-2">
                        {modifiedCurlCommand !== originalCurlCommand && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={resetModifications}
                                className="gap-1"
                            >
                                <RefreshCcw className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">
                                    Reset Changes
                                </span>
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={handleExecute}
                            disabled={isExecuting}
                            className="gap-1"
                        >
                            {isExecuting ? (
                                <>
                                    <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                                    <span>Running...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="h-3.5 w-3.5" />
                                    <span>Execute Request</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs
                    defaultValue={result ? "response" : "params"}
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="mb-4">
                        <TabsTrigger value="params">
                            Parameters
                            {!isEditingParams &&
                                parsedCommand?.queryParams &&
                                Object.keys(parsedCommand.queryParams).length >
                                    0 && (
                                    <Badge variant="secondary" className="ml-2">
                                        {
                                            Object.keys(
                                                parsedCommand.queryParams
                                            ).length
                                        }
                                    </Badge>
                                )}
                        </TabsTrigger>
                        <TabsTrigger value="headers">
                            Headers
                            {!isEditingHeaders &&
                                parsedCommand?.headers &&
                                Object.keys(parsedCommand.headers).length >
                                    0 && (
                                    <Badge variant="secondary" className="ml-2">
                                        {
                                            Object.keys(parsedCommand.headers)
                                                .length
                                        }
                                    </Badge>
                                )}
                        </TabsTrigger>
                        {(parsedCommand?.data || isEditingBody) && (
                            <TabsTrigger value="body">Body</TabsTrigger>
                        )}
                        <TabsTrigger value="response">
                            Response
                            {result && (
                                <Badge
                                    variant={
                                        result.success
                                            ? "default"
                                            : "destructive"
                                    }
                                    className="ml-2"
                                >
                                    {result.status}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="params" className="space-y-4">
                        {isEditingParams ? (
                            <div className="space-y-4">
                                <div className="rounded-md border">
                                    <div className="grid grid-cols-12 p-2 bg-muted text-sm font-medium">
                                        <div className="col-span-5">
                                            Parameter Name
                                        </div>
                                        <div className="col-span-6">Value</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                    <Separator />
                                    {Object.entries(editableParams).map(
                                        ([key, value], index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-12 p-2 gap-2 items-center"
                                            >
                                                <div className="col-span-5">
                                                    <Input
                                                        value={key}
                                                        onChange={(e) =>
                                                            updateParamKey(
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Parameter name"
                                                        className="text-xs h-8"
                                                    />
                                                </div>
                                                <div className="col-span-6">
                                                    <Input
                                                        value={value}
                                                        onChange={(e) =>
                                                            updateParamValue(
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Value"
                                                        className="text-xs h-8"
                                                    />
                                                </div>
                                                <div className="col-span-1 flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeParam(key)
                                                        }
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={addParamRow}
                                    >
                                        Add Parameter
                                    </Button>

                                    <div className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={cancelEditing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={saveParams}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {parsedCommand?.queryParams &&
                                Object.keys(parsedCommand.queryParams).length >
                                    0 ? (
                                    <div className="rounded-md border">
                                        <div className="bg-muted p-2 text-sm font-medium">
                                            Query Parameters
                                        </div>
                                        <div className="divide-y">
                                            {Object.entries(
                                                parsedCommand.queryParams
                                            ).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="grid grid-cols-3 p-2"
                                                >
                                                    <div className="font-mono text-xs">
                                                        {key}
                                                    </div>
                                                    <div className="col-span-2 font-mono text-xs break-all">
                                                        {value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <p>
                                            No query parameters found in the
                                            request
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={startEditingParams}
                                        className="gap-1"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        Edit Parameters
                                    </Button>
                                </div>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="headers" className="space-y-4">
                        {isEditingHeaders ? (
                            <div className="space-y-4">
                                <div className="rounded-md border">
                                    <div className="grid grid-cols-12 p-2 bg-muted text-sm font-medium">
                                        <div className="col-span-5">
                                            Header Name
                                        </div>
                                        <div className="col-span-6">Value</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                    <Separator />
                                    {Object.entries(editableHeaders).map(
                                        ([key, value], index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-12 p-2 gap-2 items-center"
                                            >
                                                <div className="col-span-5">
                                                    <Input
                                                        value={key}
                                                        onChange={(e) =>
                                                            updateHeaderKey(
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Header name"
                                                        className="text-xs h-8"
                                                    />
                                                </div>
                                                <div className="col-span-6">
                                                    <Input
                                                        value={value}
                                                        onChange={(e) =>
                                                            updateHeaderValue(
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Value"
                                                        className="text-xs h-8"
                                                    />
                                                </div>
                                                <div className="col-span-1 flex justify-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeHeader(key)
                                                        }
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={addHeaderRow}
                                    >
                                        Add Header
                                    </Button>

                                    <div className="space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={cancelEditing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={saveHeaders}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {parsedCommand?.headers &&
                                Object.keys(parsedCommand.headers).length >
                                    0 ? (
                                    <div className="rounded-md border">
                                        <div className="bg-muted p-2 text-sm font-medium">
                                            Request Headers
                                        </div>
                                        <div className="divide-y">
                                            {Object.entries(
                                                parsedCommand.headers
                                            ).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="grid grid-cols-3 p-2"
                                                >
                                                    <div className="font-mono text-xs">
                                                        {key}
                                                    </div>
                                                    <div className="col-span-2 font-mono text-xs break-all">
                                                        {value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground">
                                        <p>No headers found in the request</p>
                                    </div>
                                )}

                                <div className="flex justify-end mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={startEditingHeaders}
                                        className="gap-1"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        Edit Headers
                                    </Button>
                                </div>
                            </>
                        )}
                    </TabsContent>

                    {(parsedCommand?.data || isEditingBody) && (
                        <TabsContent value="body" className="space-y-4">
                            {isEditingBody ? (
                                <div className="space-y-4">
                                    <div className="rounded-md border">
                                        <div className="bg-muted p-2 text-sm font-medium">
                                            Request Body
                                        </div>
                                        <Textarea
                                            value={editableBody}
                                            onChange={(e) =>
                                                setEditableBody(e.target.value)
                                            }
                                            placeholder="Enter request body"
                                            className="font-mono text-xs min-h-[200px] border-0 rounded-t-none focus-visible:ring-0"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={cancelEditing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={saveBody}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {parsedCommand?.data ? (
                                        <div className="rounded-md border">
                                            <div className="bg-muted p-2 text-sm font-medium">
                                                Request Body
                                            </div>
                                            <pre className="p-4 text-xs font-mono overflow-auto max-h-[400px]">
                                                {formatJson(parsedCommand.data)}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-muted-foreground">
                                            <p>No request body found</p>
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={startEditingBody}
                                            className="gap-1"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                            Edit Body
                                        </Button>
                                    </div>
                                </>
                            )}
                        </TabsContent>
                    )}

                    <TabsContent value="response" className="space-y-4">
                        {result ? (
                            <>
                                <div className="flex items-center justify-between space-x-4 rounded-md bg-muted p-2">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                result.success
                                                    ? "success"
                                                    : "destructive"
                                            }
                                        >
                                            {result.status}
                                        </Badge>
                                        <span className="font-medium text-sm">
                                            {result.statusText}
                                        </span>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {result.timeMs}ms
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleDownloadResponse}
                                        className="gap-1"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">
                                            Download
                                        </span>
                                    </Button>
                                </div>

                                {result.error ? (
                                    <Alert variant="destructive">
                                        <div className="flex items-center">
                                            <X className="h-4 w-4 mr-2" />
                                            <AlertTitle>
                                                Request Failed
                                            </AlertTitle>
                                        </div>
                                        <AlertDescription>
                                            {result.error}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <div className="rounded-md border overflow-hidden">
                                        <div className="bg-muted p-2 flex justify-between items-center">
                                            <div className="text-sm font-medium">
                                                Response
                                            </div>
                                            <Badge variant="outline">
                                                {result.headers[
                                                    "content-type"
                                                ] || "Unknown Content Type"}
                                            </Badge>
                                        </div>
                                        <div className="relative">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="absolute top-2 right-2 gap-1"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <FileJson className="h-3.5 w-3.5" />
                                                            <span className="hidden sm:inline">
                                                                View Full
                                                            </span>
                                                        </div>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl h-[80vh]">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Response
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            {result.headers[
                                                                "content-type"
                                                            ] ||
                                                                "Unknown Content Type"}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="overflow-auto flex-1 h-full pb-6">
                                                        <pre className="text-xs font-mono whitespace-pre-wrap p-4">
                                                            <code>
                                                                {formatJson(
                                                                    result.body
                                                                )}
                                                            </code>
                                                        </pre>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            onClick={
                                                                handleDownloadResponse
                                                            }
                                                            className="gap-1"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download Response
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <pre className="p-4 text-xs font-mono overflow-auto max-h-[400px]">
                                                <code>
                                                    {formatJson(result.body)}
                                                </code>
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={resetExecution}
                                        className="gap-1"
                                    >
                                        <RefreshCcw className="h-3.5 w-3.5" />
                                        Reset Result
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                                <div className="rounded-full bg-muted p-3">
                                    <Play className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">
                                        Run the API Request
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                        Click "Execute Request" to run the API
                                        and see the response here. You can
                                        modify parameters, headers, or the
                                        request body before executing.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleExecute}
                                    className="mt-2 gap-1"
                                >
                                    <Play className="h-4 w-4" />
                                    Execute Request
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="text-xs text-muted-foreground">
                    {modifiedCurlCommand !== originalCurlCommand
                        ? "You've made changes to the request"
                        : "Make changes to parameters, headers, or body before executing"}
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Code className="h-3.5 w-3.5" />
                            <span>View Curl Command</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Curl Command</DialogTitle>
                            <DialogDescription>
                                Current command that will be executed
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-muted rounded-md p-4 overflow-auto max-h-[400px]">
                            <pre className="text-xs font-mono whitespace-pre-wrap">
                                <code>
                                    {modifiedCurlCommand || curlCommand}
                                </code>
                            </pre>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}

export default ApiExecutor;
