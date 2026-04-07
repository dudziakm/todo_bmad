import { test, expect } from "@playwright/test";

test.describe("Todo App", () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get("/api/todos");
    const { data } = await res.json();
    for (const todo of data) {
      await request.delete(`/api/todos/${todo.id}`);
    }
  });

  test("displays empty state when no todos exist", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/no todos yet/i)).toBeVisible();
    await expect(page.getByText(/0 items left/i)).toBeVisible();
  });

  test("creates a new todo", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder(/what needs/i).fill("Buy groceries");
    await page.getByRole("button", { name: /add/i }).click();

    await expect(page.getByText("Buy groceries")).toBeVisible();
    await expect(page.getByText(/1 item left/i)).toBeVisible();
    await expect(page.getByText(/no todos yet/i)).not.toBeVisible();
  });

  test("creates a todo by pressing Enter", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder(/what needs/i).fill("Walk the dog");
    await page.getByPlaceholder(/what needs/i).press("Enter");

    await expect(page.getByText("Walk the dog")).toBeVisible();
  });

  test("completes a todo", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder(/what needs/i).fill("Test todo");
    await page.getByRole("button", { name: /add/i }).click();
    await expect(page.getByText("Test todo")).toBeVisible();

    await page.getByRole("checkbox").click();

    await expect(page.getByRole("checkbox")).toBeChecked();
    await expect(page.getByText(/0 items left/i)).toBeVisible();
  });

  test("uncompletes a todo", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder(/what needs/i).fill("Toggle me");
    await page.getByRole("button", { name: /add/i }).click();

    await page.getByRole("checkbox").click();
    await expect(page.getByRole("checkbox")).toBeChecked();

    await page.getByRole("checkbox").click();
    await expect(page.getByRole("checkbox")).not.toBeChecked();
    await expect(page.getByText(/1 item left/i)).toBeVisible();
  });

  test("deletes a todo", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder(/what needs/i).fill("Delete me");
    await page.getByRole("button", { name: /add/i }).click();
    await expect(page.getByText("Delete me")).toBeVisible();

    await page.getByRole("button", { name: /delete/i }).click();

    await expect(page.getByText("Delete me")).not.toBeVisible();
    await expect(page.getByText(/no todos yet/i)).toBeVisible();
  });

  test("persists todos across page refresh", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder(/what needs/i).fill("Persistent todo");
    await page.getByRole("button", { name: /add/i }).click();
    await expect(page.getByText("Persistent todo")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Persistent todo")).toBeVisible();
  });

  test("manages multiple todos", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder(/what needs/i).fill("First task");
    await page.getByRole("button", { name: /add/i }).click();

    await page.getByPlaceholder(/what needs/i).fill("Second task");
    await page.getByRole("button", { name: /add/i }).click();

    await page.getByPlaceholder(/what needs/i).fill("Third task");
    await page.getByRole("button", { name: /add/i }).click();

    await expect(page.getByText(/3 items left/i)).toBeVisible();

    const checkboxes = page.getByRole("checkbox");
    await checkboxes.first().click();
    await expect(page.getByText(/2 items left/i)).toBeVisible();

    const deleteButtons = page.getByRole("button", { name: /delete/i });
    await deleteButtons.last().click();

    await expect(page.getByText(/1 item left/i)).toBeVisible();
  });

  test("prevents submitting empty todo", async ({ page }) => {
    await page.goto("/");

    const addButton = page.getByRole("button", { name: /add/i });
    await expect(addButton).toBeDisabled();

    await page.getByPlaceholder(/what needs/i).fill("   ");
    await expect(addButton).toBeDisabled();
  });

  test("clears input after adding todo", async ({ page }) => {
    await page.goto("/");

    const input = page.getByPlaceholder(/what needs/i);
    await input.fill("New todo");
    await page.getByRole("button", { name: /add/i }).click();

    await expect(input).toHaveValue("");
  });
});
