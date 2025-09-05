import type { Context, Next } from "hono";

/**
 * Middleware de autorización por Bearer Token.
 * - Valida header Authorization: "Bearer <token>"
 * - Compara contra process.env.API_TOKEN (puedes cambiar a JWT si quieres)
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid token" }, 401);
  }

  const token = authHeader.substring(7); // remove "Bearer "

  // Simple check (reemplazar por JWT en un futuro)
  if (token !== (process.env.API_TOKEN || "pruebadebearer")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};