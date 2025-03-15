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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ResultCard, EmptyResultCard } from "@/components/result-card"; // Import the new components

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
                                    <ResultCard
                                        curlCommand={result.curlCommand}
                                    />
                                ) : (
                                    <EmptyResultCard />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
