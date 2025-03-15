"use client";

import { MainSidebar } from "@/components/main-sidebar";
import React, { useState } from "react";
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
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";

export default function SettingsPage() {
    const [apiBaseUrl, setApiBaseUrl] = useState(
        "http://54.158.15.139:8000/api"
    );
    const [theme, setTheme] = useState("system");
    const [proxyEnabled, setProxyEnabled] = useState(true);

    const handleSave = () => {
        toast.success("Settings saved successfully");
    };

    const handleReset = () => {
        setApiBaseUrl("http://54.158.15.139:8000/api");
        setTheme("system");
        setProxyEnabled(true);
        toast.info("Settings reset to defaults");
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
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">
                                    HAR Analyzer
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Settings</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="p-6">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">Settings</h1>

                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>
                                        Change how the application looks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Label htmlFor="theme">Theme</Label>
                                        <Select
                                            value={theme}
                                            onValueChange={setTheme}
                                        >
                                            <SelectTrigger id="theme">
                                                <SelectValue placeholder="Select theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">
                                                    <div className="flex items-center gap-2">
                                                        <Sun className="h-4 w-4" />
                                                        <span>Light</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="dark">
                                                    <div className="flex items-center gap-2">
                                                        <Moon className="h-4 w-4" />
                                                        <span>Dark</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="system">
                                                    <div className="flex items-center gap-2">
                                                        <span>System</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>API Configuration</CardTitle>
                                    <CardDescription>
                                        Configure API endpoint and settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="api-url">
                                            API Base URL
                                        </Label>
                                        <Input
                                            id="api-url"
                                            value={apiBaseUrl}
                                            onChange={(e) =>
                                                setApiBaseUrl(e.target.value)
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Base URL for all API requests
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="proxy">
                                                    API Proxy
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Route API requests through
                                                    server to avoid CORS issues
                                                </p>
                                            </div>
                                            <Switch
                                                id="proxy"
                                                checked={proxyEnabled}
                                                onCheckedChange={
                                                    setProxyEnabled
                                                }
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Storage</CardTitle>
                                    <CardDescription>
                                        Manage application data
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">
                                        Clear locally stored settings and recent
                                        analyses
                                    </p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                    >
                                        Reset to Defaults
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            // In a real app, this would clear localStorage
                                            toast.success("Local data cleared");
                                        }}
                                    >
                                        Clear Data
                                    </Button>
                                </CardFooter>
                            </Card>

                            <div className="flex justify-end">
                                <Button onClick={handleSave}>
                                    Save Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
