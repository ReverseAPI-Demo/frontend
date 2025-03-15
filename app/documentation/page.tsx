"use client";

import { MainSidebar } from "@/components/main-sidebar";
import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Terminal, Upload, Lightbulb } from "lucide-react";

export default function DocumentationPage() {
    return (
        <SidebarProvider>
            <MainSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">
                                    HAR Analyzer
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Documentation</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="p-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">
                            Documentation
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Creating HAR Files
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">
                                            Chrome
                                        </h3>
                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                            <li>
                                                Open Chrome DevTools (F12 or
                                                Right-click → Inspect)
                                            </li>
                                            <li>Go to the Network tab</li>
                                            <li>
                                                Load the page or perform the API
                                                action
                                            </li>
                                            <li>
                                                Right-click anywhere in the
                                                network list
                                            </li>
                                            <li>
                                                Select "Save all as HAR with
                                                content"
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">
                                            Firefox
                                        </h3>
                                        <ol className="list-decimal pl-5 space-y-1 text-sm">
                                            <li>
                                                Open Firefox DevTools (F12 or
                                                Right-click → Inspect)
                                            </li>
                                            <li>Click on the Network tab</li>
                                            <li>
                                                Load the page or perform the API
                                                action
                                            </li>
                                            <li>
                                                Right-click and select "Save All
                                                As HAR"
                                            </li>
                                        </ol>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5 text-primary" />
                                        Writing Effective Descriptions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        The quality of your API description
                                        affects the accuracy of results. Here
                                        are some tips:
                                    </p>

                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>
                                            <span className="font-medium">
                                                Be specific:
                                            </span>{" "}
                                            "Get weather for San Francisco" is
                                            better than "Weather API"
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Mention the website:
                                            </span>{" "}
                                            "From RecipeScal.com"
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Include parameters:
                                            </span>{" "}
                                            "With calorie count filter"
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Describe actions:
                                            </span>{" "}
                                            "When clicking the Search button"
                                        </li>
                                    </ul>

                                    <div className="bg-muted/50 rounded-md p-3 mt-2">
                                        <p className="font-medium text-sm">
                                            Example:
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            "The API that returns flight
                                            tracking data for the Lockheed
                                            C-130H on FlightRadar24"
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="h-5 w-5 text-primary" />
                                        Using the Analyzer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ol className="list-decimal pl-5 space-y-3 text-sm">
                                        <li>
                                            <span className="font-medium">
                                                Upload HAR file
                                            </span>
                                            <p className="text-muted-foreground">
                                                Upload the HAR file you exported
                                                from your browser
                                            </p>
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Describe the API
                                            </span>
                                            <p className="text-muted-foreground">
                                                Write a clear description of the
                                                API you want to find
                                            </p>
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Analyze
                                            </span>
                                            <p className="text-muted-foreground">
                                                The system will identify the
                                                most relevant API request
                                            </p>
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Test or use
                                            </span>
                                            <p className="text-muted-foreground">
                                                Execute the API directly or copy
                                                the curl command
                                            </p>
                                        </li>
                                    </ol>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Terminal className="h-5 w-5 text-primary" />
                                        API Testing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm">
                                        After getting your API request, you can:
                                    </p>

                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>
                                            Test the API directly in the app
                                        </li>
                                        <li>
                                            Modify parameters, headers, or body
                                        </li>
                                        <li>
                                            View the response in a formatted
                                            display
                                        </li>
                                        <li>
                                            Copy the curl command to use
                                            elsewhere
                                        </li>
                                    </ul>

                                    <div className="bg-muted/50 rounded-md p-3 mt-2">
                                        <p className="text-xs text-muted-foreground">
                                            Note: Some APIs may have CORS
                                            restrictions when tested directly in
                                            the browser. The app uses a proxy
                                            server to minimize these issues, but
                                            you may still encounter restrictions
                                            with some APIs.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
