import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../../src/components/EmptyState.jsx";

describe("EmptyState", () => {
  it("renders empty state message", () => {
    render(<EmptyState />);

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it("has status role for accessibility", () => {
    render(<EmptyState />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
