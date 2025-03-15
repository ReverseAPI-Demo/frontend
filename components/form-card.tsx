"use client";

import React, { useState, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Upload,
    FileText,
    AlertCircle,
    CircleHelp,
    Loader2,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";

interface FormCardProps {
    processHAR: (file: File | null, description: string) => Promise<void>;
    isProcessing?: boolean;
}

enum UploadStep {
    FILE_UPLOAD = 0,
    API_DESCRIPTION = 1,
}

export function FormCard({ processHAR, isProcessing = false }: FormCardProps) {
    const [currentStep, setCurrentStep] = useState<UploadStep>(
        UploadStep.FILE_UPLOAD
    );
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null);

        if (acceptedFiles.length === 0) {
            return;
        }

        const selectedFile = acceptedFiles[0];

        if (!selectedFile.name.endsWith(".har")) {
            setError("Please upload a valid HAR file (.har)");
            return;
        }

        // put a cap on size so someone cant misuse (32mb)
        if (selectedFile.size > 32 * 1024 * 1024) {
            setError("File size exceeds 32MB limit");
            return;
        }

        setFile(selectedFile);
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            accept: {
                "application/json": [".har"],
            },
            maxFiles: 1,
        });

    const goToNextStep = () => {
        if (currentStep === UploadStep.FILE_UPLOAD) {
            if (!file) {
                setError("Please upload a HAR file");
                return;
            }
            setError(null);
            setCurrentStep(UploadStep.API_DESCRIPTION);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep === UploadStep.API_DESCRIPTION) {
            setCurrentStep(UploadStep.FILE_UPLOAD);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError("Please upload a HAR file");
            return;
        }

        if (!description.trim()) {
            setError("Please describe the API you want to find");
            return;
        }

        setError(null);

        try {
            await processHAR(file, description);
        } catch (err) {
            setError("An error occurred while processing your file");
            console.error(err);
        }
    };

    const renderFormStep = () => (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                goToNextStep();
            }}
            className="space-y-6"
        >
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
                    "hover:bg-muted/50",
                    isDragActive && "bg-muted/50 border-primary/50",
                    isDragReject && "bg-destructive/10 border-destructive/50",
                    file && "bg-primary/5 border-primary/50"
                )}
            >
                <Input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    {file ? (
                        <>
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="font-medium text-lg">
                                    {file.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                }}
                                className="mt-2"
                            >
                                Change file
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="font-medium text-lg">
                                    {isDragActive
                                        ? "Drop the file here"
                                        : "Drag and drop HAR file here"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    or click to browse
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Accepts HAR files only (32MB max)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={!file}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </form>
    );

    const renderDescriptionStep = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 mb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="overflow-hidden">
                    <p className="font-medium truncate">{file?.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {file && `${(file.size / 1024).toFixed(2)} KB`}
                    </p>
                </div>
            </div>

            <div className="space-y-2 pt-4">
                <label
                    htmlFor="api-description"
                    className="text-sm font-medium"
                >
                    What API are you looking for?
                </label>
                <Textarea
                    id="api-description"
                    placeholder="Describe the API you want to find, e.g., 'Get the weather for San Francisco'"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="resize-none"
                    autoFocus
                />
                <p className="text-xs text-muted-foreground">
                    Be specific about what data you're looking for. For best
                    results, include details like endpoints, parameters, or
                    expected response data.
                </p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                    type="submit"
                    className="flex-1"
                    disabled={isProcessing}
                    onClick={() => processHAR(file, description)}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Analyze HAR File"
                    )}
                </Button>
            </div>
        </form>
    );

    return (
        <Card className="w-full overflow-hidden shadow-xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>
                            {currentStep === UploadStep.FILE_UPLOAD
                                ? "Upload HAR File"
                                : "Describe API Request"}
                        </CardTitle>
                        <CardDescription>
                            {currentStep === UploadStep.FILE_UPLOAD
                                ? "Upload a HAR file from your browser"
                                : "Tell us which API request you want to extract"}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                currentStep === UploadStep.FILE_UPLOAD
                                    ? "bg-primary"
                                    : "bg-muted"
                            }`}
                        ></div>
                        <div
                            className={`w-3 h-3 rounded-full ${
                                currentStep === UploadStep.API_DESCRIPTION
                                    ? "bg-primary"
                                    : "bg-muted"
                            }`}
                        ></div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{
                            opacity: 0,
                            x:
                                currentStep === UploadStep.FILE_UPLOAD
                                    ? -20
                                    : 20,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                            opacity: 0,
                            x:
                                currentStep === UploadStep.FILE_UPLOAD
                                    ? 20
                                    : -20,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === UploadStep.FILE_UPLOAD
                            ? renderFormStep()
                            : renderDescriptionStep()}
                    </motion.div>
                </AnimatePresence>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t px-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="flex items-center text-sm text-muted-foreground hover:opacity-80 transition-all duration-200 cursor-pointer">
                            <CircleHelp className="mr-2 h-4 w-4 text-primary" />
                            {currentStep === UploadStep.FILE_UPLOAD
                                ? "How do I get a .har File?"
                                : "What do I write in the description?"}
                        </div>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>
                                {currentStep === UploadStep.FILE_UPLOAD
                                    ? "Getting a HAR File"
                                    : "Writing an Effective API Description"}
                            </SheetTitle>
                            <SheetDescription>
                                {currentStep === UploadStep.FILE_UPLOAD
                                    ? "Follow these steps to export a HAR file from your browser"
                                    : "Here's how to describe the API you want to find"}
                            </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 space-y-10  px-8">
                            {currentStep === UploadStep.FILE_UPLOAD ? (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Chrome</h3>
                                        <ol className="list-decimal ml-5 space-y-1 text-sm">
                                            <li>
                                                Open Chrome DevTools (Press F12
                                                or Right-click → Inspect)
                                            </li>
                                            <li>Go to the Network tab</li>
                                            <li>
                                                Reload the page or perform the
                                                action that triggers the API
                                                call
                                            </li>
                                            <li>
                                                Right-click anywhere in the
                                                network list and select "Save
                                                all as HAR"
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-medium">Firefox</h3>
                                        <ol className="list-decimal ml-5 space-y-1 text-sm">
                                            <li>
                                                Open Firefox DevTools (Press F12
                                                or Right-click → Inspect)
                                            </li>
                                            <li>Click on the Network tab</li>
                                            <li>
                                                Reload the page or perform the
                                                action that triggers the API
                                                call
                                            </li>
                                            <li>
                                                Right-click in the network list
                                                and select "Save All As HAR"
                                            </li>
                                        </ol>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="font-medium">
                                            Tips for effective descriptions:
                                        </h3>
                                        <ul className="list-disc ml-5 space-y-1 text-sm">
                                            <li>
                                                Be specific about the data you
                                                want (e.g., "weather forecast
                                                for San Francisco")
                                            </li>
                                            <li>
                                                Mention any known parameters
                                                (e.g., "search recipes with 500
                                                calories")
                                            </li>
                                            <li>
                                                Include the website or service
                                                name if known
                                            </li>
                                            <li>
                                                Describe when the API is
                                                triggered (e.g., "when clicking
                                                the Search button")
                                            </li>
                                            <li>
                                                If you know partial endpoint
                                                details, include them (e.g.,
                                                "/api/v2/weather")
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-medium">
                                            Example descriptions:
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                "API that returns weather data
                                                for San Francisco when I search
                                                on SFGate"
                                            </p>
                                            <p>
                                                "The API used to search for
                                                recipes with specific calorie
                                                counts on RecipeScal"
                                            </p>
                                            <p>
                                                "Flight tracking API for the
                                                Lockheed C-130H Hercules on
                                                FlightRadar24"
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <SheetFooter className="mt-6">
                            <SheetClose asChild>
                                <Button>Got it</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </CardFooter>
        </Card>
    );
}
