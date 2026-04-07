import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "../../src/components/TodoList.jsx";

const todos = [
  {
    id: 1,
    title: "First",
    completed: false,
    createdAt: "2026-04-07T10:00:00.000Z",
    updatedAt: "2026-04-07T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Second",
    completed: true,
    createdAt: "2026-04-07T09:00:00.000Z",
    updatedAt: "2026-04-07T10:00:00.000Z",
  },
];

describe("TodoList", () => {
  it("renders all todos", () => {
    render(
      <TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders nothing when empty", () => {
    const { container } = render(
      <TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(container.querySelector(".todo-list")).not.toBeInTheDocument();
  });

  it("renders as a list element", () => {
    render(
      <TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
