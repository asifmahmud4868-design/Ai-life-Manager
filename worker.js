export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Gemini API
    if (url.pathname === "/api/ai" && request.method === "POST") {
      try {
        const body = await request.json();

        if (!body.prompt) {
          return json({ error: "Prompt is required" }, 400);
        }

        if (!env.GEMINI_API_KEY) {
          return json({ error: "Gemini API key is not configured" }, 500);
        }

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
            env.GEMINI_API_KEY,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: body.prompt
                    }
                  ]
                }
              ]
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return json(
            {
              error: "Gemini API error",
              details: data
            },
            response.status
          );
        }

        return json(data);
      } catch (error) {
        return json(
          {
            error: "AI request failed",
            details: error.message
          },
          500
        );
      }
    }

    // Google Sheets endpoint
    if (url.pathname === "/api/sheets") {
      return json({
        message: "Google Sheets endpoint is ready for configuration."
      });
    }

    // Let Cloudflare Assets handle the PWA
    return env.ASSETS.fetch(request);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
