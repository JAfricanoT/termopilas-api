import type { Context, Next } from "hono";

const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid token" }, 401);
  }

  const token = authHeader.substring(7); // remove "Bearer "

  // Simple check (replace with JWT or your logic)
  if (token !== process.env.API_TOKEN) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};
