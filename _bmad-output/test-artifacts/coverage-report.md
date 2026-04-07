# Test Coverage Report — Todo App

Generated: 2026-04-07

## Summary

| Area     | Statements | Branches | Functions | Lines  | Target | Status |
|----------|------------|----------|-----------|--------|--------|--------|
| Backend  | 92.00%     | 94.11%   | 90.90%    | 92.00% | >= 80% | PASS   |
| Frontend | 97.93%     | 88.63%   | 100.00%   | 100.00%| >= 70% | PASS   |
| Overall  | ~95%       | ~91%     | ~95%      | ~96%   | >= 70% | PASS   |

## Test Counts

| Suite              | Test Files | Tests | Status |
|--------------------|------------|-------|--------|
| Backend (Vitest)   | 1          | 22    | PASS   |
| Frontend (Vitest)  | 8          | 47    | PASS   |
| E2E (Playwright)   | 1          | 10    | PASS   |
| **Total**          | **10**     | **79**| **PASS** |

## Backend Coverage Detail

| File          | Stmts  | Branch | Funcs  | Lines  |
|---------------|--------|--------|--------|--------|
| app.js        | 100%   | 100%   | 100%   | 100%   |
| database.js   | 100%   | 100%   | 100%   | 100%   |
| errors.js     | 0%     | 100%   | 0%     | 0%     |
| todos.js      | 92.72% | 93.93% | 100%   | 92.72% |

### Coverage Gaps

- `errors.js` — Generic error handler only triggered by unhandled exceptions.
  Not covered because all API errors are handled within route handlers.
  The middleware exists as a safety net for unexpected failures.
- `todos.js` lines 95-111 — PATCH validation for title update with empty/long
  string. These edge cases are tested for POST but not PATCH.

## Frontend Coverage Detail

| File           | Stmts  | Branch | Funcs  | Lines  |
|----------------|--------|--------|--------|--------|
| App.jsx        | 100%   | 100%   | 100%   | 100%   |
| todos.js (api) | 100%   | 83.33% | 100%   | 100%   |
| EmptyState.jsx | 100%   | 100%   | 100%   | 100%   |
| ErrorBanner.jsx| 100%   | 100%   | 100%   | 100%   |
| TodoForm.jsx   | 94.11% | 87.5%  | 100%   | 100%   |
| TodoItem.jsx   | 100%   | 100%   | 100%   | 100%   |
| TodoList.jsx   | 100%   | 100%   | 100%   | 100%   |
| useTodos.js    | 97.72% | 50%    | 100%   | 100%   |

### Coverage Gaps

- `todos.js` branch: fallback error messages in catch blocks (line 20, 34)
- `useTodos.js` branch: edge case where `toggleTodo` is called with
  nonexistent ID (no-op path)
