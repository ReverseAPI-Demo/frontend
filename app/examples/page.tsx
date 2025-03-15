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
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Book, Plane, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ExampleCardProps {
    title: string;
    description: string;
    website: string;
    query: string;
    curlCommand: string;
    icon: React.ReactNode;
    tags: string[];
}

function ExampleCard({
    title,
    description,
    website,
    query,
    curlCommand,
    icon,
    tags,
}: ExampleCardProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(curlCommand);
        toast.success("Copied to clipboard");
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            {icon}
                            <CardTitle>{title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm flex items-center">
                        <span className="underline">{website}</span>
                        <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground" />
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium">User Query</p>
                    <p className="text-sm italic">&quot;{query}&quot;</p>
                </div>

                <div>
                    <p className="text-sm font-medium">curl Command</p>
                    <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto mt-1 relative">
                        <code className="break-all whitespace-pre-wrap">
                            {curlCommand}
                        </code>
                    </pre>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleCopy}
                >
                    <Copy className="h-4 w-4" />
                    Copy curl Command
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ExamplesPage() {
    const examples: ExampleCardProps[] = [
        {
            title: "SFGate Weather",
            description:
                "Extract the API that fetches weather data for a specific location",
            website: "weather.example.com",
            query: "Return the API that fetches the weather of San Francisco.",
            curlCommand: `curl -X GET "https://api.weather.example.com/v1/current?city=san-francisco&units=imperial" \\
  -H "Accept: application/json" \\
  -H "User-Agent: Mozilla/5.0" \\
  -H "X-API-Key: demokey123"`,
            icon: <Cloud className="h-5 w-5 text-blue-500" />,
            tags: ["GET", "Weather", "Forecasting", "Location"],
        },
        {
            title: "Recipe Search API",
            description:
                "Extract the API that fetches recipes based on filters",
            website: "recipes.example.com",
            query: "Can you reverse engineer the API that gives me recipes for a given portion and calorie count?",
            curlCommand: `curl -X POST "https://api.recipes.example.com/v2/search" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer token123" \\
  -d '{"filters": {"calories": {"max": 600}, "servings": 4}, "page": 1, "limit": 10}'`,
            icon: <Book className="h-5 w-5 text-green-500" />,
            tags: ["POST", "Food", "Filtering", "Search"],
        },
        {
            title: "Flight Tracking API",
            description:
                "Extract the API that provides real-time flight information",
            website: "flights.example.com",
            query: "Can you give me a curl command to get info about the Lockheed C-130H Hercules HERBLK?",
            curlCommand: `curl -X GET "https://api.flights.example.com/v3/flights/AC302?departure=YYZ&arrival=YVR" \\
  -H "Accept: application/json" \\
  -H "X-App-Key: flight_app_key_123" \\
  -H "X-Session-ID: sess_7f8a9b2c3d"`,
            icon: <Plane className="h-5 w-5 text-purple-500" />,
            tags: ["GET", "Travel", "Real-time", "Tracking"],
        },
    ];

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
                                <BreadcrumbPage>Examples</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="p-6">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">
                            Example Use Cases
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            These examples demonstrate common scenarios where
                            the HAR Analyzer can help you extract and use APIs.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {examples.map((example) => (
                                <ExampleCard key={example.title} {...example} />
                            ))}
                        </div>

                        <div className="mt-8 bg-muted rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-2">
                                Try It Yourself
                            </h2>
                            <p className="text-muted-foreground">
                                To try these examples, visit the websites,
                                generate a HAR file using your browser's
                                developer tools, then use the analyzer with the
                                example queries. You can also modify the queries
                                to match your specific needs.
                            </p>
                            <Button className="mt-4" asChild>
                                <a href="/">Go to Analyzer</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
