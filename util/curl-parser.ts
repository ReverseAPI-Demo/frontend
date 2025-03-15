export interface ParsedCurlCommand {
    method: string;
    url: string;
    headers: Record<string, string>;
    data?: string;
    hasAuth: boolean;
    authType?: string;
    queryParams: Record<string, string>;
}

export function parseCurlCommand(curlCommand: string): ParsedCurlCommand {
    const result: ParsedCurlCommand = {
        method: "GET",
        url: "",
        headers: {},
        hasAuth: false,
        queryParams: {},
    };

    const normalizedCommand = curlCommand
        .replace(/\\(\r\n|\n)/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const urlMatch = normalizedCommand.match(
        /curl\s+(-X\s+\w+\s+)?["']?([^"'\s]+)["']?/i
    );
    if (urlMatch) {
        result.url = urlMatch[2].replace(/["']/g, "");
    }

    const urlObj = new URL(
        result.url.startsWith("http")
            ? result.url
            : `http://placeholder.com${result.url}`
    );
    urlObj.searchParams.forEach((value, key) => {
        result.queryParams[key] = value;
    });

    const methodMatch = normalizedCommand.match(/-X\s+(\w+)/i);
    if (methodMatch) {
        result.method = methodMatch[1].toUpperCase();
    }

    const headerMatches = normalizedCommand.matchAll(
        /-H\s+["']([^:"']+):\s*([^"']+)["']/gi
    );
    for (const match of headerMatches) {
        const headerName = match[1].trim();
        const headerValue = match[2].trim();
        result.headers[headerName] = headerValue;

        if (
            headerName.toLowerCase() === "authorization" ||
            headerName.toLowerCase().includes("auth") ||
            headerName.toLowerCase().includes("token") ||
            headerName.toLowerCase().includes("api-key")
        ) {
            result.hasAuth = true;

            const lowerValue = headerValue.toLowerCase();
            if (lowerValue.startsWith("bearer")) {
                result.authType = "Bearer Token";
            } else if (lowerValue.startsWith("basic")) {
                result.authType = "Basic Auth";
            } else if (
                lowerValue.includes("api") ||
                lowerValue.includes("key")
            ) {
                result.authType = "API Key";
            } else {
                result.authType = "Custom Auth";
            }
        }
    }

    const dataMatch = normalizedCommand.match(/-d\s+["'](.+?)["']/i);
    if (dataMatch) {
        result.data = dataMatch[1];

        if (!methodMatch && result.method === "GET") {
            result.method = "POST";
        }
    }

    return result;
}

export function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url.startsWith("http") ? url : `http://${url}`);
        return urlObj.hostname;
    } catch (e) {
        const domainMatch = url.match(
            /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/im
        );
        return domainMatch ? domainMatch[1] : "unknown";
    }
}

export function simplifyUrl(url: string): string {
    try {
        const urlObj = new URL(url.startsWith("http") ? url : `http://${url}`);
        return `${urlObj.origin}${urlObj.pathname}${
            urlObj.search ? "?..." : ""
        }`;
    } catch (e) {
        return url;
    }
}

export function formatCurlCommand(curlCommand: string): string {
    return curlCommand
        .replace(/\s+-H\s+/g, " \\\n  -H ")
        .replace(/\s+-d\s+/g, " \\\n  -d ")
        .replace(/\s+-X\s+/g, " \\\n  -X ")
        .replace(/\s+--data\s+/g, " \\\n  --data ");
}
