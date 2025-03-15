"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ReadmePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
            <div className="container mx-auto px-4 py-12 max-w-3xl ">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">
                        Take Home Assessment - Neel
                    </h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="lead text-lg text-center mb-8">
                            Hi Felix and Adrian! This is my perspective on how
                            to design a Reverse Engineering App for an API using
                            HAR files. I have implemented all the core features
                            and some extra ones as well which are all explained
                            below. Hope you like it!
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">
                            Core Features
                        </h2>
                        <ol className="list-disc pl-6 space-y-2">
                            <li>
                                Upload HAR files through a simple drag-and-drop
                                interface
                            </li>
                            <li>
                                Identifies specific api that the user is
                                requesting.
                            </li>
                            <li>
                                Curl command generation from API har request.
                            </li>
                        </ol>
                        <h2 className="text-2xl font-semibold mt-8 mb-4">
                            Extra Features
                        </h2>
                        <ol className="list-disc pl-6 space-y-2">
                            <li>Direct API testing in the browser</li>
                            <li>
                                Extra information like headers, parameters,
                                response times, api url etc
                            </li>
                            <li>
                                Request parameter and header modification
                                (mostly works, needs extensive testing though
                                due to a lot of combinations)
                            </li>
                            <li>
                                History tracking and filtering of past requests
                            </li>
                            <li>Well formatted curl command</li>
                            <li>Settings page (currently a complete mock)</li>
                        </ol>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">
                            Implementation
                        </h2>
                        <p>The project consists of two main parts:</p>
                        <ol className="list-decimal pl-6 pb-4 space-y-2">
                            <li>
                                Backend (RESTAPI using FastAPI) : Handles
                                parsing of the har files, AI requests, and curl
                                command generating.
                            </li>
                            <li>
                                Frontend (Next.js): Provides a simple modern UI
                                for interacting with the backend, testing
                                requests, and managing history
                            </li>
                        </ol>

                        <em>
                            You can look at the readme files for both repos to
                            get a little more info about the code and how to run
                            the project locally.
                        </em>

                        <strong>
                            <p className="pt-12 px-8">
                                Hopefully that explains most of the application,
                                click the button below to get inside the
                                application. It is hosted on vercel for the
                                frontend and EC2 instance for backend.
                            </p>
                        </strong>
                    </div>

                    <div className="mt-12 text-center">
                        <Button asChild className="px-8 py-6 text-lg gap-2">
                            <Link href="/">
                                Go to Application{" "}
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
