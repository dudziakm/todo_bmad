# Todo App — BMAD Method

A full-stack Todo application built using the [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) — a spec-driven, agent-powered development framework.

## Features

| Feature             | Description                                           |
|---------------------|-------------------------------------------------------|
| CRUD operations     | Create, read, toggle, and delete todos                |
| Persistent storage  | SQLite — data survives refreshes and restarts         |
| Responsive UI       | Works from 375px mobile to 1920px desktop             |
| Visual status       | Completed tasks shown with strikethrough + muted text |
| Error handling      | Optimistic UI with rollback, error banners            |
| Dockerized          | Full stack runs via `docker compose up`               |
| Accessible          | WCAG AA compliant, keyboard navigable, ARIA labels    |

## Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React 19, Vite 6          |
| Backend    | Express 5, Node 22        |
| Database   | SQLite (better-sqlite3)   |
| Testing    | Vitest, Playwright        |
| Container  | Docker, Docker Compose    |
| Package Mgr| pnpm (workspace)          |

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start both frontend and backend
pnpm dev

# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
```

### Docker

```bash
# Build and run
docker compose up --build

# App available at http://localhost:8080
# API available at http://localhost:3000
```

### Testing

```bash
# Unit + integration tests
pnpm test

# Test coverage
pnpm test:coverage

# E2E tests (requires dev servers running)
pnpm dev  # in one terminal
node e2e/run-e2e.js  # in another terminal
```

## Project Structure

```
todo_bmad/
├── backend/                  # Express API
│   ├── src/
│   │   ├── index.js          #   Entry point
│   │   ├── app.js            #   Express app factory
│   │   ├── routes/todos.js   #   CRUD endpoints
│   │   ├── db/database.js    #   SQLite schema & connection
│   │   └── middleware/errors.js
│   ├── tests/                #   Integration tests (22 tests)
│   └── Dockerfile
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── App.jsx           #   Root component
│   │   ├── components/       #   TodoForm, TodoItem, TodoList, etc.
│   │   ├── hooks/useTodos.js #   State management hook
│   │   ├── api/todos.js      #   API client
│   │   └── styles/app.css
│   ├── tests/                #   Component + hook tests (47 tests)
│   ├── nginx.conf            #   Production reverse proxy
│   └── Dockerfile
├── e2e/                      # End-to-end tests
│   ├── tests/todo-app.spec.js  # Playwright test specs (10 tests)
│   ├── run-e2e.js            #   Standalone Playwright runner
│   └── playwright.config.js
├── _bmad-output/             # BMAD artifacts
│   ├── planning-artifacts/   #   Brief, architecture, stories
│   └── test-artifacts/       #   Coverage, security, accessibility
├── docs/                     # Documentation
│   └── ai-integration-log.md
├── docker-compose.yml
├── PRD.md
└── APP_IDEA.md
```

## API

| Method   | Endpoint          | Description          |
|----------|-------------------|----------------------|
| `GET`    | `/api/todos`      | List all todos       |
| `POST`   | `/api/todos`      | Create a todo        |
| `PATCH`  | `/api/todos/:id`  | Update a todo        |
| `DELETE` | `/api/todos/:id`  | Delete a todo        |
| `GET`    | `/api/health`     | Health check         |

## Test Results

| Suite              | Tests | Coverage (Stmts) |
|--------------------|-------|-------------------|
| Backend (Vitest)   | 22    | 92%               |
| Frontend (Vitest)  | 47    | 98%               |
| E2E (Playwright)   | 10    | —                 |
| **Total**          | **79**|                   |

## BMAD Artifacts

| Artifact                                                          | Persona              |
|-------------------------------------------------------------------|----------------------|
| [Product Brief](_bmad-output/planning-artifacts/product-brief.md) | PM (John)            |
| [Architecture](_bmad-output/planning-artifacts/architecture.md)   | Architect (Winston)  |
| [Epics & Stories](_bmad-output/planning-artifacts/epics-and-stories.md) | SM (Bob)       |
| [Test Strategy](_bmad-output/planning-artifacts/test-strategy.md) | QA (Murat)           |
| [Coverage Report](_bmad-output/test-artifacts/coverage-report.md) | QA (Quinn)           |
| [Security Review](_bmad-output/test-artifacts/security-review.md) | QA (Quinn)           |
| [Accessibility Audit](_bmad-output/test-artifacts/accessibility-audit.md) | QA (Murat)   |
| [AI Integration Log](docs/ai-integration-log.md)                 | —                    |

## BMAD Method

This project follows a four-step spec-driven process:

1. **Specifications** — PM refines PRD, Architect defines technical design, stories with acceptance criteria
2. **Implementation** — Backend API, frontend UI, tests built following specs
3. **Containerization** — Dockerfiles with multi-stage builds, Docker Compose orchestration
4. **Quality Assurance** — Coverage analysis, accessibility audits, security review
