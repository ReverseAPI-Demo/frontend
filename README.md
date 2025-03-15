# Frontend

Frontend is a Next.js web app that allows users to extract and test API requests from .har files.

## Project Structure

-   `app/` - Main application folder with pages
-   `components/` - some custom components and mostly shadcn/ui components
-   `services/` - Services for managing backend api/history
    -   `api.ts` - Backend API service
    -   `history.ts` - Local storage service for tracking user history
    -   `execute.ts` - Service extending the api service which allos us to execute requests.
-   `hooks/` - Custom hooks:
    -   `useHarAnalyzer.ts` - Main hook for analyzing HAR files
    -   `useApiExecutor.ts` - Hook for executing API requests
-   `utils/` - util functions

## How to run

1. Install libraries: `yarn install`
2. Run the dev server: `yarn run dev`
