import express from "express";
import cors from "cors";
import { createTodoRouter } from "./routes/todos.js";
import { errorHandler } from "./middleware/errors.js";

export function createApp(db) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/todos", createTodoRouter(db));

  app.use(errorHandler);

  return app;
}
