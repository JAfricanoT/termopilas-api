import type { Context, Next } from "hono";

/**
 * Middleware de autorización por Bearer Token.
 * - Valida header Authorization: "Bearer <token>"
 * - Compara contra process.env.API_TOKEN (puedes cambiar a JWT si quieres)
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid token" }, 401);
  }

  const token = authHeader.substring(7); // remove "Bearer "

  const selectedToken = "prueba";
  //  const selectedToken = await postgres.select().from()

  // Simple check (reemplazar por JWT en un futuro)
  if (token !== selectedToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
}
