const APPS_SCRIPT_URL = "আপনার Apps Script /exec URL";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/command" && request.method === "POST") {
      try {
        const body = await request.json();

        const response = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const result = await response.text();

        return new Response(result, {
          status: response.status,
          headers: {
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: error.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
