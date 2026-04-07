import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "../../src/components/TodoForm.jsx";

describe("TodoForm", () => {
  it("renders input and submit button", () => {
    render(<TodoForm onAdd={vi.fn()} />);

    expect(screen.getByPlaceholderText(/what needs/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("focuses input on mount", () => {
    render(<TodoForm onAdd={vi.fn()} />);

    expect(screen.getByPlaceholderText(/what needs/i)).toHaveFocus();
  });

  it("disables submit when input is empty", () => {
    render(<TodoForm onAdd={vi.fn()} />);

    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  it("enables submit when input has text", async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/what needs/i), "Test");

    expect(screen.getByRole("button", { name: /add/i })).toBeEnabled();
  });

  it("calls onAdd with trimmed title on submit", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TodoForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText(/what needs/i), "  Buy milk  ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(onAdd).toHaveBeenCalledWith("Buy milk");
  });

  it("clears input after successful submit", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TodoForm onAdd={onAdd} />);

    const input = screen.getByPlaceholderText(/what needs/i);
    await user.type(input, "Test");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(input).toHaveValue("");
  });

  it("submits on Enter key", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TodoForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText(/what needs/i), "Test{enter}");

    expect(onAdd).toHaveBeenCalledWith("Test");
  });
});
