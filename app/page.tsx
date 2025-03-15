"use client";
import { MainSidebar } from "@/components/main-sidebar";
import React, { useEffect, useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { FormCard } from "@/components/form-card";
import useHarAnalyzer from "@/hooks/useHarAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const { analyzeHarFile, isProcessing, isApiConnected, result } =
        useHarAnalyzer();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleCopy = () => {
        if (result?.curlCommand) {
            navigator.clipboard.writeText(result.curlCommand);
            toast.success("Copied to clipboard");
        }
    };

    return (
        <SidebarProvider>
            <MainSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">
                                    API Analyzer
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {isLoading ? (
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <Skeleton className="aspect-video" />
                            <Skeleton className="aspect-video" />
                            <Skeleton className="aspect-video" />
                        </div>
                        <Skeleton className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                    </div>
                ) : (
                    <div className="p-4">
                        {!isApiConnected && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>API Connection Error</AlertTitle>
                                <AlertDescription>
                                    Could not connect to the API service. The
                                    application may not function properly.
                                    Please try again later or contact support if
                                    the issue persists.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <FormCard
                                    processHAR={analyzeHarFile}
                                    isProcessing={isProcessing}
                                />
                            </div>

                            <div>
                                {result ? (
                                    <Card className="h-full shadow-xl">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center">
                                                <div className="flex-1">
                                                    API Request Details
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="ml-auto flex items-center gap-1"
                                                    onClick={handleCopy}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                    <span className="hidden sm:inline">
                                                        Copy
                                                    </span>
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-2">
                                            <div className="rounded-md border bg-muted/50">
                                                <div className="flex items-center justify-between border-b bg-muted px-4 py-2">
                                                    <div className="text-sm font-medium">
                                                        curl Command
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        API Request
                                                    </Badge>
                                                </div>
                                                <div className="relative">
                                                    <pre className="max-h-[60vh] overflow-auto p-4 text-xs scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                                        <code className="font-mono whitespace-pre-wrap break-all">
                                                            {result.curlCommand}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid grid-cols-1 gap-4">
                                                <div className="rounded-md border bg-card p-4">
                                                    <h3 className="text-sm font-medium mb-2">
                                                        What to do with this
                                                        command?
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        You can run this curl
                                                        command in your terminal
                                                        to replicate the API
                                                        request. You can also
                                                        modify parameters or
                                                        headers to customize the
                                                        request.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="rounded-md border bg-card p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <Copy className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <h3 className="text-sm font-medium">
                                                                Copy and Use
                                                            </h3>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Copy the curl
                                                            command and paste it
                                                            in your terminal to
                                                            execute the API
                                                            request directly.
                                                        </p>
                                                    </div>

                                                    <div className="rounded-md border bg-card p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="text-primary"
                                                                >
                                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-sm font-medium">
                                                                Save for Later
                                                            </h3>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Bookmark this page
                                                            or save the command
                                                            to use it in your
                                                            scripts or
                                                            documentation.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="h-full flex flex-col">
                                        <CardHeader>
                                            <CardTitle>
                                                API Request Details
                                            </CardTitle>
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
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                    ></circle>
                                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                    <line
                                                        x1="12"
                                                        y1="17"
                                                        x2="12.01"
                                                        y2="17"
                                                    ></line>
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">
                                                No API Request Yet
                                            </h3>
                                            <p className="text-sm text-muted-foreground max-w-md">
                                                Upload a HAR file and provide a
                                                description of the API you're
                                                looking for. Once analyzed, the
                                                curl command will appear here.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
