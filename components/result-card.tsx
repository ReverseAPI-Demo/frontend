"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Copy,
    Server,
    Globe,
    Key,
    Link2,
    Terminal,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    parseCurlCommand,
    extractDomain,
    formatCurlCommand,
    type ParsedCurlCommand,
} from "@/util/curl-parser";

interface ResultCardProps {
    curlCommand: any;
}

export function ResultCard({ curlCommand }: ResultCardProps) {
    const [parsedCommand, setParsedCommand] =
        useState<ParsedCurlCommand | null>(null);
    const [formattedCommand, setFormattedCommand] =
        useState<string>(curlCommand);

    useEffect(() => {
        try {
            const parsed = parseCurlCommand(curlCommand);
            setParsedCommand(parsed);
            setFormattedCommand(formatCurlCommand(curlCommand));
        } catch (error) {
            console.error("Error parsing curl command:", error);
            // If parsing fails, still show the original command
            setFormattedCommand(curlCommand);
        }
    }, [curlCommand]);

    const handleCopy = () => {
        navigator.clipboard.writeText(curlCommand);
        toast.success("Copied to clipboard");
    };

    const domain = parsedCommand?.url ? extractDomain(parsedCommand.url) : "";
    const queryParamCount = parsedCommand?.queryParams
        ? Object.keys(parsedCommand.queryParams).length
        : 0;
    const headerCount = parsedCommand?.headers
        ? Object.keys(parsedCommand.headers).length
        : 0;

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                    <div className="flex-1">API Request Details</div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto flex items-center gap-1"
                        onClick={handleCopy}
                    >
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy</span>
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
                {parsedCommand && (
                    <div className="grid gap-4 mb-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Terminal className="h-3 w-3 mr-1" />
                                    Method
                                </div>
                                <Badge variant="outline" className="font-mono">
                                    {parsedCommand.method}
                                </Badge>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Globe className="h-3 w-3 mr-1" />
                                    Domain
                                </div>
                                <div className="text-xs font-medium truncate">
                                    {domain}
                                </div>
                            </div>

                            {parsedCommand.hasAuth && (
                                <div className="space-y-1">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Key className="h-3 w-3 mr-1" />
                                        Auth
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {parsedCommand.authType ||
                                            "Authentication"}
                                    </Badge>
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Link2 className="h-3 w-3 mr-1" />
                                    Params
                                </div>
                                <div className="text-xs font-medium">
                                    {queryParamCount} parameters
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Tabs defaultValue="curl" className="mb-6">
                    <TabsList className="mb-4">
                        <TabsTrigger value="curl">curl Command</TabsTrigger>
                        {parsedCommand && headerCount > 0 && (
                            <TabsTrigger value="headers">
                                {headerCount} Headers
                            </TabsTrigger>
                        )}
                        {parsedCommand && queryParamCount > 0 && (
                            <TabsTrigger value="params">
                                {queryParamCount} Parameters
                            </TabsTrigger>
                        )}
                        {parsedCommand?.data && (
                            <TabsTrigger value="body">Request Body</TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="curl">
                        <div className="rounded-md border bg-muted/50">
                            <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                                <div className="text-sm font-medium">
                                    curl Command
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {parsedCommand?.method || "API"} Request
                                    </Badge>
                                </div>
                            </div>
                            <div className="relative">
                                <pre className="max-h-[40vh] overflow-auto p-4 text-xs scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                    <code className="font-mono whitespace-pre-wrap break-all">
                                        {formattedCommand}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </TabsContent>

                    {parsedCommand && headerCount > 0 && (
                        <TabsContent value="headers">
                            <div className="rounded-md border bg-muted/50">
                                <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                                    <div className="text-sm font-medium">
                                        Request Headers
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2">
                                        {Object.entries(
                                            parsedCommand.headers
                                        ).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="grid grid-cols-3 gap-4"
                                            >
                                                <div className="font-mono text-xs text-muted-foreground">
                                                    {key}
                                                </div>
                                                <div className="col-span-2 font-mono text-xs break-all">
                                                    {value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    )}

                    {parsedCommand && queryParamCount > 0 && (
                        <TabsContent value="params">
                            <div className="rounded-md border bg-muted/50">
                                <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                                    <div className="text-sm font-medium">
                                        Query Parameters
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2">
                                        {Object.entries(
                                            parsedCommand.queryParams
                                        ).map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="grid grid-cols-3 gap-4"
                                            >
                                                <div className="font-mono text-xs text-muted-foreground">
                                                    {key}
                                                </div>
                                                <div className="col-span-2 font-mono text-xs break-all">
                                                    {value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    )}

                    {parsedCommand?.data && (
                        <TabsContent value="body">
                            <div className="rounded-md border bg-muted/50">
                                <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                                    <div className="text-sm font-medium">
                                        Request Body
                                    </div>
                                </div>
                                <div className="p-4">
                                    <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                        {parsedCommand.data}
                                    </pre>
                                </div>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-md border bg-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Server className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-sm font-medium">
                                Run in Terminal
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Copy the curl command and paste it in your terminal
                            to execute the API request directly.
                        </p>
                    </div>

                    <div className="rounded-md border bg-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <ExternalLink className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-sm font-medium">Use in Code</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Convert this curl command to code in your preferred
                            programming language using tools like Postman or
                            curl converter.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function EmptyResultCard() {
    return (
        <Card className="h-max flex flex-col">
            <CardHeader>
                <CardTitle>API Request Details</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No API Request Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                    Upload a HAR file and provide a description of the API
                    you're looking for. Once analyzed, the curl command will
                    appear here.
                </p>
            </CardContent>
        </Card>
    );
}
