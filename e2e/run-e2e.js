import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || "http://localhost:3000";

let browser;
let passed = 0;
let failed = 0;
const results = [];

async function cleanTodos() {
  const res = await fetch(`${API_URL}/api/todos`);
  const { data } = await res.json();
  for (const todo of data) {
    await fetch(`${API_URL}/api/todos/${todo.id}`, {
      method: "DELETE",
    });
  }
}

async function runTest(name, fn) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await cleanTodos();
    await fn(page);
    passed++;
    results.push({ name, status: "PASS" });
    console.log(`  PASS  ${name}`);
  } catch (err) {
    failed++;
    results.push({ name, status: "FAIL", error: err.message });
    console.log(`  FAIL  ${name}`);
    console.log(`        ${err.message}`);
  } finally {
    await context.close();
  }
}

async function expect(locator) {
  return {
    async toBeVisible(opts = {}) {
      await locator.waitFor({
        state: "visible",
        timeout: opts.timeout || 5000,
      });
    },
    async notToBeVisible(opts = {}) {
      await locator.waitFor({
        state: "hidden",
        timeout: opts.timeout || 5000,
      });
    },
    async toBeChecked() {
      const checked = await locator.isChecked();
      if (!checked)
        throw new Error("Expected checkbox to be checked");
    },
    async notToBeChecked() {
      const checked = await locator.isChecked();
      if (checked)
        throw new Error("Expected checkbox to not be checked");
    },
    async toBeDisabled() {
      const disabled = await locator.isDisabled();
      if (!disabled)
        throw new Error("Expected element to be disabled");
    },
    async toHaveValue(expected) {
      const value = await locator.inputValue();
      if (value !== expected)
        throw new Error(
          `Expected value "${expected}" but got "${value}"`,
        );
    },
  };
}

async function main() {
  console.log("\nRunning E2E Tests\n");

  browser = await chromium.launch({ headless: true });

  await runTest(
    "displays empty state when no todos exist",
    async (page) => {
      await page.goto(BASE_URL);
      const e = await expect(page.getByText(/no todos yet/i));
      await e.toBeVisible();
      const e2 = await expect(page.getByText(/0 items left/i));
      await e2.toBeVisible();
    },
  );

  await runTest("creates a new todo", async (page) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder(/what needs/i).fill("Buy groceries");
    await page.getByRole("button", { name: /add/i }).click();
    const e = await expect(page.getByText("Buy groceries"));
    await e.toBeVisible();
    const e2 = await expect(page.getByText(/1 item left/i));
    await e2.toBeVisible();
  });

  await runTest("creates a todo by pressing Enter", async (page) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder(/what needs/i).fill("Walk the dog");
    await page.getByPlaceholder(/what needs/i).press("Enter");
    const e = await expect(page.getByText("Walk the dog"));
    await e.toBeVisible();
  });

  await runTest("completes a todo", async (page) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder(/what needs/i).fill("Test todo");
    await page.getByRole("button", { name: /add/i }).click();
    const e0 = await expect(page.getByText("Test todo"));
    await e0.toBeVisible();

    await page.getByRole("checkbox").click();
    const e = await expect(page.getByRole("checkbox"));
    await e.toBeChecked();
    const e2 = await expect(page.getByText(/0 items left/i));
    await e2.toBeVisible();
  });

  await runTest("uncompletes a todo", async (page) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder(/what needs/i).fill("Toggle me");
    await page.getByRole("button", { name: /add/i }).click();

    await page.getByRole("checkbox").click();
    const e = await expect(page.getByRole("checkbox"));
    await e.toBeChecked();

    await page.getByRole("checkbox").click();
    const e2 = await expect(page.getByRole("checkbox"));
    await e2.notToBeChecked();
  });

  await runTest("deletes a todo", async (page) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder(/what needs/i).fill("Delete me");
    await page.getByRole("button", { name: /add/i }).click();
    const e0 = await expect(page.getByText("Delete me"));
    await e0.toBeVisible();

    await page.getByRole("button", { name: /delete/i }).click();
    const e = await expect(page.getByText("Delete me"));
    await e.notToBeVisible();
    const e2 = await expect(page.getByText(/no todos yet/i));
    await e2.toBeVisible();
  });

  await runTest(
    "persists todos across page refresh",
    async (page) => {
      await page.goto(BASE_URL);
      await page
        .getByPlaceholder(/what needs/i)
        .fill("Persistent todo");
      await page.getByRole("button", { name: /add/i }).click();
      const e0 = await expect(page.getByText("Persistent todo"));
      await e0.toBeVisible();

      await page.reload();
      const e = await expect(page.getByText("Persistent todo"));
      await e.toBeVisible();
    },
  );

  await runTest("manages multiple todos", async (page) => {
    await page.goto(BASE_URL);

    await page.getByPlaceholder(/what needs/i).fill("First task");
    await page.getByRole("button", { name: /add/i }).click();
    await page.getByPlaceholder(/what needs/i).fill("Second task");
    await page.getByRole("button", { name: /add/i }).click();
    await page.getByPlaceholder(/what needs/i).fill("Third task");
    await page.getByRole("button", { name: /add/i }).click();

    const e0 = await expect(page.getByText(/3 items left/i));
    await e0.toBeVisible();

    await page.getByRole("checkbox").first().click();
    const e1 = await expect(page.getByText(/2 items left/i));
    await e1.toBeVisible();

    await page.getByRole("button", { name: /delete/i }).last().click();
    const e2 = await expect(page.getByText(/1 item/i));
    await e2.toBeVisible();
  });

  await runTest("prevents submitting empty todo", async (page) => {
    await page.goto(BASE_URL);
    const e = await expect(
      page.getByRole("button", { name: /add/i }),
    );
    await e.toBeDisabled();
  });

  await runTest("clears input after adding todo", async (page) => {
    await page.goto(BASE_URL);
    const input = page.getByPlaceholder(/what needs/i);
    await input.fill("New todo");
    await page.getByRole("button", { name: /add/i }).click();
    await page.waitForTimeout(500);
    const e = await expect(input);
    await e.toHaveValue("");
  });

  await browser.close();

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
