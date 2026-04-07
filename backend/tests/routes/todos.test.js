import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app.js";
import { createTestDatabase } from "../../src/db/database.js";

describe("Todo API", () => {
  let app;
  let db;

  beforeEach(() => {
    db = createTestDatabase();
    app = createApp(db);
  });

  afterEach(() => {
    db.close();
  });

  describe("GET /api/health", () => {
    it("returns ok status", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe("GET /api/todos", () => {
    it("returns empty array when no todos", async () => {
      const res = await request(app).get("/api/todos");

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("returns all todos newest first", async () => {
      await request(app)
        .post("/api/todos")
        .send({ title: "First" });
      await request(app)
        .post("/api/todos")
        .send({ title: "Second" });

      const res = await request(app).get("/api/todos");

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].title).toBe("Second");
      expect(res.body.data[1].title).toBe("First");
    });

    it("returns todos with camelCase fields", async () => {
      await request(app)
        .post("/api/todos")
        .send({ title: "Test" });

      const res = await request(app).get("/api/todos");
      const todo = res.body.data[0];

      expect(todo).toHaveProperty("id");
      expect(todo).toHaveProperty("title");
      expect(todo).toHaveProperty("completed");
      expect(todo).toHaveProperty("createdAt");
      expect(todo).toHaveProperty("updatedAt");
      expect(todo.completed).toBe(false);
    });
  });

  describe("POST /api/todos", () => {
    it("creates todo with valid title", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "Buy groceries" });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Buy groceries");
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data.id).toBeDefined();
    });

    it("trims whitespace from title", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "  Trimmed  " });

      expect(res.body.data.title).toBe("Trimmed");
    });

    it("returns 400 for missing title", async () => {
      const res = await request(app).post("/api/todos").send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("returns 400 for empty title", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("returns 400 for whitespace-only title", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "   " });

      expect(res.status).toBe(400);
    });

    it("returns 400 for title over 255 chars", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: "a".repeat(256) });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain("255");
    });

    it("returns 400 for non-string title", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({ title: 123 });

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/todos/:id", () => {
    it("toggles completed to true", async () => {
      const created = await request(app)
        .post("/api/todos")
        .send({ title: "Test" });
      const id = created.body.data.id;

      const res = await request(app)
        .patch(`/api/todos/${id}`)
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.data.completed).toBe(true);
    });

    it("toggles completed back to false", async () => {
      const created = await request(app)
        .post("/api/todos")
        .send({ title: "Test" });
      const id = created.body.data.id;

      await request(app)
        .patch(`/api/todos/${id}`)
        .send({ completed: true });

      const res = await request(app)
        .patch(`/api/todos/${id}`)
        .send({ completed: false });

      expect(res.status).toBe(200);
      expect(res.body.data.completed).toBe(false);
    });

    it("updates title", async () => {
      const created = await request(app)
        .post("/api/todos")
        .send({ title: "Old" });
      const id = created.body.data.id;

      const res = await request(app)
        .patch(`/api/todos/${id}`)
        .send({ title: "New" });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("New");
    });

    it("updates updated_at timestamp", async () => {
      const created = await request(app)
        .post("/api/todos")
        .send({ title: "Test" });
      const id = created.body.data.id;

      const res = await request(app)
        .patch(`/api/todos/${id}`)
        .send({ completed: true });

      expect(res.body.data.updatedAt).toBeDefined();
    });

    it("returns 404 for nonexistent id", async () => {
      const res = await request(app)
        .patch("/api/todos/999")
        .send({ completed: true });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .patch("/api/todos/abc")
        .send({ completed: true });

      expect(res.status).toBe(400);
    });

    it("returns 400 for invalid completed type", async () => {
      const created = await request(app)
        .post("/api/todos")
        .send({ title: "Test" });
      const id = created.body.data.id;

      const res = await request(app)
        .patch(`/api/todos/${id}`)
        .send({ completed: "yes" });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("deletes existing todo", async () => {
      const created = await request(app)
        .post("/api/todos")
        .send({ title: "Delete me" });
      const id = created.body.data.id;

      const res = await request(app).delete(`/api/todos/${id}`);
      expect(res.status).toBe(204);
    });

    it("returns 404 for nonexistent id", async () => {
      const res = await request(app).delete("/api/todos/999");
      expect(res.status).toBe(404);
    });

    it("confirms todo is removed after deletion", async () => {
      const created = await request(app)
        .post("/api/todos")
        .send({ title: "Gone" });
      const id = created.body.data.id;

      await request(app).delete(`/api/todos/${id}`);

      const list = await request(app).get("/api/todos");
      expect(list.body.data).toHaveLength(0);
    });

    it("returns 400 for invalid id format", async () => {
      const res = await request(app).delete("/api/todos/abc");
      expect(res.status).toBe(400);
    });
  });
});
