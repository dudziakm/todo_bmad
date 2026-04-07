import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "../../src/api/todos.js";

const mockTodo = {
  id: 1,
  title: "Test",
  completed: false,
  createdAt: "2026-04-07T10:00:00.000Z",
  updatedAt: "2026-04-07T10:00:00.000Z",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("fetchTodos", () => {
  it("returns todos on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [mockTodo] }),
    });

    const result = await fetchTodos();

    expect(result).toEqual([mockTodo]);
    expect(fetch).toHaveBeenCalledWith("/api/todos");
  });

  it("throws on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(fetchTodos()).rejects.toThrow("Failed to fetch todos");
  });
});

describe("createTodo", () => {
  it("sends POST and returns created todo", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockTodo }),
    });

    const result = await createTodo("Test");

    expect(result).toEqual(mockTodo);
    expect(fetch).toHaveBeenCalledWith("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test" }),
    });
  });

  it("throws with error message on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({ error: { message: "Title is required" } }),
    });

    await expect(createTodo("")).rejects.toThrow("Title is required");
  });
});

describe("updateTodo", () => {
  it("sends PATCH and returns updated todo", async () => {
    const updated = { ...mockTodo, completed: true };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: updated }),
    });

    const result = await updateTodo(1, { completed: true });

    expect(result).toEqual(updated);
    expect(fetch).toHaveBeenCalledWith("/api/todos/1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
  });

  it("throws on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({ error: { message: "Not found" } }),
    });

    await expect(updateTodo(999, { completed: true })).rejects.toThrow(
      "Not found",
    );
  });
});

describe("deleteTodo", () => {
  it("sends DELETE request", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    await deleteTodo(1);

    expect(fetch).toHaveBeenCalledWith("/api/todos/1", {
      method: "DELETE",
    });
  });

  it("throws on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(deleteTodo(999)).rejects.toThrow("Failed to delete todo");
  });
});
