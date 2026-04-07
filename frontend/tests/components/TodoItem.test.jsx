import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "../../src/components/TodoItem.jsx";

const activeTodo = {
  id: 1,
  title: "Buy groceries",
  completed: false,
  createdAt: "2026-04-07T10:00:00.000Z",
  updatedAt: "2026-04-07T10:00:00.000Z",
};

const completedTodo = {
  id: 2,
  title: "Walk the dog",
  completed: true,
  createdAt: "2026-04-07T09:00:00.000Z",
  updatedAt: "2026-04-07T10:00:00.000Z",
};

describe("TodoItem", () => {
  it("renders todo title", () => {
    render(
      <TodoItem todo={activeTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("shows unchecked checkbox for active todo", () => {
    render(
      <TodoItem todo={activeTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("shows checked checkbox for completed todo", () => {
    render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("applies completed class when completed", () => {
    const { container } = render(
      <TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(container.querySelector(".todo-item")).toHaveClass("completed");
  });

  it("calls onToggle with id when checkbox clicked", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <TodoItem todo={activeTodo} onToggle={onToggle} onDelete={vi.fn()} />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it("calls onDelete with id when delete clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <TodoItem todo={activeTodo} onToggle={vi.fn()} onDelete={onDelete} />,
    );

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("has accessible labels", () => {
    render(
      <TodoItem todo={activeTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(
      screen.getByLabelText(/mark "buy groceries" as complete/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/delete "buy groceries"/i),
    ).toBeInTheDocument();
  });
});
