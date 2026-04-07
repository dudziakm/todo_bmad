import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTodos } from "../../src/hooks/useTodos.js";
import * as api from "../../src/api/todos.js";

vi.mock("../../src/api/todos.js");

const mockTodo = {
  id: 1,
  title: "Test",
  completed: false,
  createdAt: "2026-04-07T10:00:00.000Z",
  updatedAt: "2026-04-07T10:00:00.000Z",
};

beforeEach(() => {
  vi.restoreAllMocks();
  api.fetchTodos.mockResolvedValue([]);
});

describe("useTodos", () => {
  it("loads todos on mount", async () => {
    api.fetchTodos.mockResolvedValue([mockTodo]);

    const { result } = renderHook(() => useTodos());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.todos).toEqual([mockTodo]);
    expect(result.current.error).toBeNull();
  });

  it("sets error on fetch failure", async () => {
    api.fetchTodos.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.todos).toEqual([]);
  });

  it("adds a todo", async () => {
    const newTodo = { ...mockTodo, id: 2, title: "New" };
    api.createTodo.mockResolvedValue(newTodo);

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.addTodo("New");
    });

    expect(result.current.todos).toContainEqual(newTodo);
    expect(api.createTodo).toHaveBeenCalledWith("New");
  });

  it("sets error when addTodo fails", async () => {
    api.createTodo.mockRejectedValue(new Error("Failed"));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.addTodo("New");
      } catch {
        // expected
      }
    });

    expect(result.current.error).toBe("Failed");
  });

  it("toggles a todo optimistically", async () => {
    api.fetchTodos.mockResolvedValue([mockTodo]);
    api.updateTodo.mockResolvedValue({
      ...mockTodo,
      completed: true,
    });

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(1);
    });

    await act(async () => {
      await result.current.toggleTodo(1);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  it("reverts toggle on API failure", async () => {
    api.fetchTodos.mockResolvedValue([mockTodo]);
    api.updateTodo.mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(1);
    });

    await act(async () => {
      await result.current.toggleTodo(1);
    });

    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.error).toBe("Server error");
  });

  it("removes a todo optimistically", async () => {
    api.fetchTodos.mockResolvedValue([mockTodo]);
    api.deleteTodo.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(1);
    });

    await act(async () => {
      await result.current.removeTodo(1);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it("reverts removal on API failure", async () => {
    api.fetchTodos.mockResolvedValue([mockTodo]);
    api.deleteTodo.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(1);
    });

    await act(async () => {
      await result.current.removeTodo(1);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.error).toBe("Delete failed");
  });

  it("dismisses error", async () => {
    api.fetchTodos.mockRejectedValue(new Error("Error"));

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.error).toBe("Error");
    });

    act(() => {
      result.current.dismissError();
    });

    expect(result.current.error).toBeNull();
  });

  it("retries loading", async () => {
    api.fetchTodos
      .mockRejectedValueOnce(new Error("Error"))
      .mockResolvedValue([mockTodo]);

    const { result } = renderHook(() => useTodos());

    await waitFor(() => {
      expect(result.current.error).toBe("Error");
    });

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.todos).toEqual([mockTodo]);
    expect(result.current.error).toBeNull();
  });
});
