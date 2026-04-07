import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App.jsx";
import * as api from "../src/api/todos.js";

vi.mock("../src/api/todos.js");

const mockTodo = {
  id: 1,
  title: "Existing todo",
  completed: false,
  createdAt: "2026-04-07T10:00:00.000Z",
  updatedAt: "2026-04-07T10:00:00.000Z",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("shows loading state initially", () => {
    api.fetchTodos.mockReturnValue(new Promise(() => {}));
    render(<App />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows empty state when no todos", async () => {
    api.fetchTodos.mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });

  it("renders todos after loading", async () => {
    api.fetchTodos.mockResolvedValue([mockTodo]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Existing todo")).toBeInTheDocument();
    });

    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
  });

  it("shows error banner when fetch fails", async () => {
    api.fetchTodos.mockRejectedValue(new Error("Network error"));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("adds a todo through the form", async () => {
    api.fetchTodos.mockResolvedValue([]);
    api.createTodo.mockResolvedValue({
      ...mockTodo,
      id: 2,
      title: "New task",
    });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/what needs/i),
      "New task",
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("New task")).toBeInTheDocument();
    });
  });

  it("shows items left count", async () => {
    api.fetchTodos.mockResolvedValue([
      mockTodo,
      { ...mockTodo, id: 2, title: "Second", completed: true },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
    });
  });
});
