import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  // Lista blanca (ajústala a tus orígenes reales)
  origin: (origin) => {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:7070',
      'http://localhost:5173',
    ];
    return !!origin && allowed.includes(origin);
  },
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // Importante: Authorization para tu Bearer token
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  credentials: true,
  maxAge: 86400, // cachea la preflight un día
});