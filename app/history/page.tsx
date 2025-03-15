"use client";

import { MainSidebar } from "@/components/main-sidebar";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Copy,
    Trash2,
    Clock,
    FileText,
    History,
    Search,
    Terminal,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import historyService, { HistoryEntry } from "@/services/history";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toTitleCase } from "@/util/misc";

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        // Load history from localStorage
        const entries = historyService.getEntries();
        setHistory(entries);
        setFilteredHistory(entries);
    }, []);

    useEffect(() => {
        const filtered = history.filter(
            (entry) =>
                entry.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                entry.fileName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                entry.curlCommand
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
        setFilteredHistory(filtered);
    }, [searchQuery, history]);

    const handleCopy = (curlCommand: string) => {
        navigator.clipboard.writeText(curlCommand);
        toast.success("Copied to clipboard");
    };

    const handleDelete = (id: string) => {
        const success = historyService.deleteEntry(id);
        if (success) {
            setHistory((prev) => prev.filter((entry) => entry.id !== id));
            toast.success("Entry deleted");
        } else {
            toast.error("Failed to delete entry");
        }
    };

    const handleClearAll = () => {
        historyService.clearHistory();
        setHistory([]);
        toast.success("History cleared");
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
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
                                <BreadcrumbPage>History</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <History className="h-7 w-7" />
                                Analysis History
                            </h1>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="hidden sm:inline">
                                                Clear All
                                            </span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Clear History
                                            </DialogTitle>
                                            <DialogDescription>
                                                Are you sure you want to clear
                                                all history? This action cannot
                                                be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                className="bg-rose-600 hover:bg-rose-700"
                                                onClick={handleClearAll}
                                            >
                                                Clear All
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search history..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {filteredHistory.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                                    {history.length === 0 ? (
                                        <>
                                            <History className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium mb-2">
                                                No History Yet
                                            </h3>
                                            <p className="text-muted-foreground max-w-md">
                                                Your API analysis history will
                                                appear here once you start using
                                                the analyzer.
                                            </p>
                                            <Button className="mt-4" asChild>
                                                <a href="/">Go to Analyzer</a>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium mb-2">
                                                No Results Found
                                            </h3>
                                            <p className="text-muted-foreground max-w-md">
                                                No history entries match your
                                                search query. Try different
                                                search terms.
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() =>
                                                    setSearchQuery("")
                                                }
                                            >
                                                Clear Search
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredHistory.map((entry) => (
                                    <Card
                                        key={entry.id}
                                        className="overflow-hidden"
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg line-clamp-1">
                                                        {toTitleCase(
                                                            entry.description
                                                        )}
                                                    </CardTitle>
                                                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                                                        <Clock className="h-3 w-3" />
                                                        <span>
                                                            {formatDate(
                                                                entry.timestamp
                                                            )}
                                                        </span>
                                                        <Separator
                                                            orientation="vertical"
                                                            className="h-3"
                                                        />
                                                        <FileText className="h-3 w-3" />
                                                        <span>
                                                            {entry.fileName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <span className="sr-only">
                                                                Open menu
                                                            </span>
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
                                                                className="lucide lucide-more-vertical"
                                                            >
                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="1"
                                                                ></circle>
                                                                <circle
                                                                    cx="12"
                                                                    cy="5"
                                                                    r="1"
                                                                ></circle>
                                                                <circle
                                                                    cx="12"
                                                                    cy="19"
                                                                    r="1"
                                                                ></circle>
                                                            </svg>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleCopy(
                                                                    entry.curlCommand
                                                                )
                                                            }
                                                            className="cursor-pointer"
                                                        >
                                                            <Copy className="h-4 w-4 mr-2" />
                                                            Copy curl command
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    entry.id
                                                                )
                                                            }
                                                            className="cursor-pointer text-rose-600 focus:text-rose-700"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete entry
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2">
                                            <div className="bg-muted rounded-md overflow-hidden border">
                                                <div className="bg-muted/90 border-b px-3 py-1.5 flex justify-between items-center">
                                                    <div className="flex items-center text-sm font-medium">
                                                        <Terminal className="h-3.5 w-3.5 mr-1.5" />
                                                        curl Command
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 w-6 p-0"
                                                        onClick={() =>
                                                            handleCopy(
                                                                entry.curlCommand
                                                            )
                                                        }
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                                <div className="p-3">
                                                    <pre className="text-xs overflow-x-auto max-h-24 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                                        <code className="break-all whitespace-pre-wrap">
                                                            {entry.curlCommand}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {entry.tags?.map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className="text-xs px-2 py-0 h-5"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 gap-1 text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                                    asChild
                                                >
                                                    <a href="/">
                                                        <ExternalLink className="h-3 w-3" />
                                                        <span className="text-xs">
                                                            Use Again
                                                        </span>
                                                    </a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
