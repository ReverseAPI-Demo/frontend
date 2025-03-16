import { NextResponse } from "next/server";

// boilerplate code I generally add for deploying if backend doesnt allow https.
// need to use vercel as a proxy to allow http requests since backend doesnt have ssl due to temporary setup

export async function GET(request) {
    const path = request.nextUrl.pathname.replace("/api/", "");
    return proxyRequest(request, path);
}

export async function POST(request) {
    const path = request.nextUrl.pathname.replace("/api/", "");
    return proxyRequest(request, path);
}

async function proxyRequest(request, path) {
    console.log(`Proxying request to: http://54.158.15.139:8000/api/${path}`);

    try {
        const body =
            request.method !== "GET" ? await request.json() : undefined;

        const response = await fetch(`http://54.158.15.139:8000/api/${path}`, {
            method: request.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const responseData = await response.text();

        try {
            const data = JSON.parse(responseData);
            return NextResponse.json(data, { status: response.status });
        } catch (e) {
            return new NextResponse(responseData, {
                status: response.status,
                headers: { "Content-Type": "text/plain" },
            });
        }
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Failed to proxy request to backend" },
            { status: 500 }
        );
    }
}
