import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { WebSocket, WebSocketServer } from "ws";

let wsClients: Set<WebSocket> = new Set();

// Initialize WebSocket server with HTTP server
export function initializeWebSocketServer(server: HttpServer | HttpsServer) {
  const wss = new WebSocketServer({ server });
  
  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");
    wsClients.add(ws);
    
    ws.on("close", () => {
      console.log("Client disconnected");
      wsClients.delete(ws);
    });
    
    // Keep-alive ping to prevent connections from being dropped
    ws.on("pong", () => {
      (ws as any).isAlive = true;
    });
  });
  
  // Implement heartbeat mechanism to keep connections alive
  const interval = setInterval(() => {
    wsClients.forEach((ws: any) => {
      if (ws.isAlive === false) {
        wsClients.delete(ws);
        return ws.terminate();
      }
      
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
  
  wss.on("close", () => clearInterval(interval));
  
  return wss;
}

// Function to broadcast messages to all connected clients
export function broadcastToClients(data: any) {
  const message = JSON.stringify(data);
  wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
