import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "StudyBuddy server is running" });
  });

  // User management endpoints (minimal, as CometChat handles most user operations)
  app.get("/api/users", async (_req, res) => {
    try {
      // This would typically fetch from CometChat, but for demo purposes
      // we're keeping it simple as the frontend handles CometChat directly
      res.json({ message: "User management handled by CometChat SDK" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Chat sessions endpoint (for potential future use)
  app.post("/api/chat-sessions", async (req, res) => {
    try {
      // Create chat session record
      res.json({ message: "Chat session created" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
