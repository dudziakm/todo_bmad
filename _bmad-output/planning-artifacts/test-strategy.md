# Test Strategy — Todo App

## Testing Pyramid

```
        ┌─────────┐
        │  E2E    │  5-8 tests   (Playwright)
        │ Browser │  User journeys
       ┌┴─────────┴┐
       │Integration │  15-20 tests (Vitest + supertest)
       │  API       │  Endpoint behavior
      ┌┴────────────┴┐
      │   Unit        │  20-30 tests (Vitest)
      │   Components  │  Isolated logic
      └───────────────┘
```

## Test Tools

| Layer       | Tool              | Purpose                              |
|-------------|-------------------|--------------------------------------|
| Unit        | Vitest            | Component and function tests         |
| Integration | Vitest + supertest | API endpoint tests with real DB     |
| E2E         | Playwright        | Full browser user journey tests      |
| Coverage    | Vitest (v8)       | Code coverage reporting              |
| Accessibility | axe-core (via Playwright) | WCAG AA compliance         |

## Unit Tests

### Backend

| Test File              | What It Tests                          |
|------------------------|----------------------------------------|
| database.test.js       | DB init, schema creation, connection   |

### Frontend

| Test File              | What It Tests                          |
|------------------------|----------------------------------------|
| TodoForm.test.jsx      | Input handling, submit, validation     |
| TodoItem.test.jsx      | Display, toggle click, delete click    |
| TodoList.test.jsx      | List rendering, empty state, loading   |
| useTodos.test.js       | Hook state management, API calls       |
| todos.test.js (api)    | API client functions                   |

## Integration Tests

| Test File              | What It Tests                          |
|------------------------|----------------------------------------|
| todos.test.js (routes) | All CRUD endpoints with real SQLite DB |

### Scenarios Per Endpoint

**GET /api/todos:**
- Returns empty array when no todos
- Returns all todos ordered by newest first
- Returns correct field format (camelCase)

**POST /api/todos:**
- Creates todo with valid title
- Returns 400 for missing title
- Returns 400 for empty/whitespace title
- Returns 400 for title > 255 chars
- Trims whitespace from title

**PATCH /api/todos/:id:**
- Toggles completed to true
- Toggles completed to false
- Updates title
- Returns 404 for nonexistent id
- Returns 400 for invalid id format

**DELETE /api/todos/:id:**
- Deletes existing todo (204)
- Returns 404 for nonexistent id
- Confirms todo is removed from subsequent GET

**GET /api/health:**
- Returns 200 with status ok

## E2E Tests (Playwright)

| Test                        | User Journey                                |
|-----------------------------|---------------------------------------------|
| Create todo                 | Type text, submit, verify appears in list   |
| Complete todo               | Click checkbox, verify visual change        |
| Delete todo                 | Click delete, verify removed from list      |
| Empty state                 | Load app with no todos, verify message      |
| Persistence                 | Create todo, refresh page, verify persists  |
| Multiple operations         | Create 3, complete 1, delete 1, verify state|
| Input validation            | Try empty submit, verify prevented          |
| Error recovery              | Verify app handles API errors gracefully    |

## Coverage Targets

| Area        | Target  | Measure                          |
|-------------|---------|----------------------------------|
| Backend     | >= 80%  | Statement coverage via v8        |
| Frontend    | >= 70%  | Statement coverage via v8        |
| Overall     | >= 70%  | Combined meaningful coverage     |

## Quality Gates

| Gate                  | Criteria                              | Blocks      |
|-----------------------|---------------------------------------|-------------|
| Unit tests pass       | All green                             | PR merge    |
| Integration tests pass | All green                            | PR merge    |
| E2E tests pass        | >= 5 tests green                     | Release     |
| Coverage threshold    | >= 70%                               | Release     |
| Accessibility         | Zero critical WCAG violations        | Release     |
| Security              | No XSS, SQLi, or data exposure       | Release     |

## Test Environment

- Unit/Integration: In-memory SQLite (fresh DB per test suite)
- E2E: Docker Compose stack or local dev servers
- CI: Headless Playwright on Linux
