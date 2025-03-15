// boilerplate code I generally add for deploying to vercel if backend doesnt allow https.
// need to use vercel as a proxy to allow http requests since backend doesnt have ssl due to temporary setup

export default async function handler(req, res) {
    const { path } = req.query;
    const endpoint = Array.isArray(path) ? path.join("/") : path;

    try {
        const response = await fetch(
            `http://54.158.15.139:8000/api/${endpoint}`,
            {
                method: req.method,
                headers: {
                    "Content-Type": "application/json",
                    ...req.headers,
                },
                body:
                    req.method !== "GET" ? JSON.stringify(req.body) : undefined,
            }
        );

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Failed to connect to API server" });
    }
}
