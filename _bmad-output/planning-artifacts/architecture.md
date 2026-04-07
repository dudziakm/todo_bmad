# Architecture Design — Todo App

## Tech Stack

| Layer      | Technology          | Rationale                                                |
|------------|---------------------|----------------------------------------------------------|
| Frontend   | React 19 + Vite 6   | Fast dev experience, component model, wide ecosystem     |
| Backend    | Express.js (Node 22) | Minimal, well-understood, ESM-native                    |
| Database   | SQLite (better-sqlite3) | Zero-config, file-based, sufficient for single-user  |
| Testing    | Vitest + Playwright  | Fast unit/integration tests + browser E2E               |
| Linting    | oxlint              | Fast, strict, modern                                     |
| Runtime    | Node.js 22 LTS      | Current LTS, ESM support                                |
| Package Mgr| pnpm                | Fast, disk-efficient, strict                             |
| Container  | Docker + Compose    | Portable deployment, multi-service orchestration         |

## System Architecture

```
┌─────────────────┐     HTTP      ┌─────────────────┐     SQL      ┌──────────┐
│   React SPA     │ ──────────── │   Express API   │ ──────────── │  SQLite  │
│   (Vite dev)    │   REST/JSON   │   /api/todos    │  better-     │  todos.db│
│   Port 5173     │               │   Port 3000     │  sqlite3     │          │
└─────────────────┘               └─────────────────┘              └──────────┘
```

## Project Structure

```
todo_bmad/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express app entry point
│   │   ├── routes/
│   │   │   └── todos.js      # Todo CRUD routes
│   │   ├── db/
│   │   │   └── database.js   # SQLite connection & schema
│   │   └── middleware/
│   │       └── errors.js     # Error handling middleware
│   ├── tests/
│   │   ├── routes/
│   │   │   └── todos.test.js # API integration tests
│   │   └── db/
│   │       └── database.test.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.jsx          # React entry
│   │   ├── App.jsx           # Root component
│   │   ├── components/
│   │   │   ├── TodoList.jsx
│   │   │   ├── TodoItem.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── hooks/
│   │   │   └── useTodos.js   # Data fetching hook
│   │   ├── api/
│   │   │   └── todos.js      # API client
│   │   └── styles/
│   │       └── app.css
│   ├── tests/
│   │   ├── components/
│   │   │   ├── TodoList.test.jsx
│   │   │   ├── TodoItem.test.jsx
│   │   │   └── TodoForm.test.jsx
│   │   └── hooks/
│   │       └── useTodos.test.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── e2e/
│   ├── tests/
│   │   └── todo-app.spec.js  # Playwright E2E tests
│   ├── playwright.config.js
│   └── package.json
├── docker-compose.yml
├── _bmad-output/             # BMAD artifacts
├── docs/                     # Documentation
├── PRD.md
└── APP_IDEA.md
```

## Data Model

### Todo

| Field       | Type      | Constraints                    |
|-------------|-----------|--------------------------------|
| id          | INTEGER   | PRIMARY KEY, AUTOINCREMENT     |
| title       | TEXT      | NOT NULL, max 255 chars        |
| completed   | INTEGER   | NOT NULL, DEFAULT 0 (boolean)  |
| created_at  | TEXT      | NOT NULL, ISO 8601 timestamp   |
| updated_at  | TEXT      | NOT NULL, ISO 8601 timestamp   |

## API Contract

Base URL: `/api/todos`

### Endpoints

#### GET /api/todos

List all todos, ordered by creation date (newest first).

**Response 200:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2026-04-07T10:00:00.000Z",
      "updatedAt": "2026-04-07T10:00:00.000Z"
    }
  ]
}
```

#### POST /api/todos

Create a new todo.

**Request:**
```json
{
  "title": "Buy groceries"
}
```

**Response 201:**
```json
{
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**Response 400:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required"
  }
}
```

#### PATCH /api/todos/:id

Update a todo (toggle completion or edit title).

**Request:**
```json
{
  "completed": true
}
```

**Response 200:**
```json
{
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": true,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:05:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found"
  }
}
```

#### DELETE /api/todos/:id

Delete a todo permanently.

**Response 204:** No content.

**Response 404:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found"
  }
}
```

#### GET /api/health

Health check endpoint for Docker.

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-07T10:00:00.000Z"
}
```

## Frontend Component Architecture

```
App
├── TodoForm         # Input field + submit button
├── TodoList         # Container for todo items
│   └── TodoItem[]   # Individual todo with toggle + delete
└── EmptyState       # Shown when no todos exist
```

### State Management

- `useTodos` custom hook manages all todo state and API calls
- Optimistic updates for toggle/delete (revert on failure)
- Loading states per-operation (create, toggle, delete)
- Global error state with dismissible messages

## Cross-Cutting Concerns

### Error Handling

- Backend: centralized error middleware, consistent JSON error format
- Frontend: try/catch in API calls, user-visible error messages, auto-dismiss

### CORS

- Development: Vite proxy to backend (no CORS needed)
- Production/Docker: Nginx serves frontend, proxies `/api` to backend

### Security (v1 scope)

- Input validation (title length, type checking)
- SQL injection prevention (parameterized queries via better-sqlite3)
- XSS prevention (React auto-escapes by default)
- No sensitive data in this version (no auth)

## Docker Architecture

```
docker-compose.yml
├── frontend (nginx:alpine)
│   ├── Serves built React SPA
│   └── Proxies /api → backend:3000
├── backend (node:22-alpine)
│   ├── Express API on port 3000
│   └── SQLite volume mount
└── Volume: todo-data (SQLite persistence)
```
