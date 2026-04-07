import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBanner } from "../../src/components/ErrorBanner.jsx";

describe("ErrorBanner", () => {
  it("renders nothing when no message", () => {
    const { container } = render(
      <ErrorBanner message={null} onDismiss={vi.fn()} />,
    );

    expect(container.querySelector(".error-banner")).not.toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<ErrorBanner message="Something failed" onDismiss={vi.fn()} />);

    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });

  it("has alert role", () => {
    render(<ErrorBanner message="Error" onDismiss={vi.fn()} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss clicked", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<ErrorBanner message="Error" onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: /dismiss/i }));

    expect(onDismiss).toHaveBeenCalled();
  });
});
