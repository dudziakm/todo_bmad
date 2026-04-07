# Epics & User Stories — Todo App

## Epic 1: Project Foundation

### Story 1.1: Project Setup & Infrastructure

**As a** developer, **I want** a properly configured monorepo with backend and frontend scaffolding, **so that** I can start implementing features immediately.

**Acceptance Criteria:**
- [ ] Backend: Node 22, ESM, Express, pnpm, Vitest configured
- [ ] Frontend: React 19, Vite 6, pnpm, Vitest configured
- [ ] E2E: Playwright configured with test runner
- [ ] Linting: oxlint configured for both packages
- [ ] All packages install and build without errors
- [ ] Dev server starts and serves a placeholder page

**Story Points:** 3

---

### Story 1.2: Database Schema & Connection

**As a** developer, **I want** a SQLite database with the todos table, **so that** data can be persisted.

**Acceptance Criteria:**
- [ ] SQLite connection initializes on app start
- [ ] `todos` table created with id, title, completed, created_at, updated_at
- [ ] Database auto-creates if missing
- [ ] Connection closes cleanly on shutdown
- [ ] Unit tests for database initialization

**Story Points:** 2

---

## Epic 2: Backend API

### Story 2.1: List Todos (GET /api/todos)

**As a** user, **I want** to retrieve all my todos, **so that** I can see my task list.

**Acceptance Criteria:**
- [ ] Returns 200 with array of todos in `{ data: [...] }` format
- [ ] Todos ordered by created_at descending (newest first)
- [ ] Empty array returned when no todos exist
- [ ] Fields: id, title, completed (boolean), createdAt, updatedAt
- [ ] Integration test passing

**Story Points:** 2

---

### Story 2.2: Create Todo (POST /api/todos)

**As a** user, **I want** to create a new todo, **so that** I can track a new task.

**Acceptance Criteria:**
- [ ] Accepts `{ title: string }` in request body
- [ ] Returns 201 with created todo
- [ ] Returns 400 if title is missing or empty
- [ ] Returns 400 if title exceeds 255 characters
- [ ] Trims whitespace from title
- [ ] Integration tests for success and validation cases

**Story Points:** 2

---

### Story 2.3: Update Todo (PATCH /api/todos/:id)

**As a** user, **I want** to toggle a todo's completion status, **so that** I can mark tasks as done.

**Acceptance Criteria:**
- [ ] Accepts `{ completed: boolean }` and/or `{ title: string }`
- [ ] Returns 200 with updated todo
- [ ] Returns 404 if todo doesn't exist
- [ ] Updates `updated_at` timestamp
- [ ] Integration tests for success, not found, and validation

**Story Points:** 2

---

### Story 2.4: Delete Todo (DELETE /api/todos/:id)

**As a** user, **I want** to delete a todo, **so that** I can remove tasks I no longer need.

**Acceptance Criteria:**
- [ ] Returns 204 on successful deletion
- [ ] Returns 404 if todo doesn't exist
- [ ] Todo is permanently removed from database
- [ ] Integration tests for success and not found

**Story Points:** 1

---

### Story 2.5: Health Check (GET /api/health)

**As a** DevOps engineer, **I want** a health endpoint, **so that** Docker can monitor container health.

**Acceptance Criteria:**
- [ ] Returns 200 with `{ status: "ok", timestamp: "..." }`
- [ ] Responds within 100ms
- [ ] Integration test passing

**Story Points:** 1

---

## Epic 3: Frontend UI

### Story 3.1: Todo List Display

**As a** user, **I want** to see all my todos when I open the app, **so that** I can review my tasks.

**Acceptance Criteria:**
- [ ] Todos fetched and displayed on page load
- [ ] Each todo shows title and completion status
- [ ] Completed todos visually distinct (strikethrough + muted color)
- [ ] Loading spinner shown while fetching
- [ ] Empty state message when no todos exist
- [ ] Component tests passing

**Story Points:** 3

---

### Story 3.2: Create Todo Form

**As a** user, **I want** to add new todos via an input field, **so that** I can capture new tasks quickly.

**Acceptance Criteria:**
- [ ] Text input + submit button (or Enter key)
- [ ] Input clears after successful submission
- [ ] Submit disabled when input is empty
- [ ] Error message shown if creation fails
- [ ] Input focused on page load
- [ ] Component tests passing

**Story Points:** 2

---

### Story 3.3: Toggle Todo Completion

**As a** user, **I want** to click a todo to toggle it complete/incomplete, **so that** I can track progress.

**Acceptance Criteria:**
- [ ] Clicking checkbox toggles completion state
- [ ] Optimistic UI update (instant visual feedback)
- [ ] Reverts on API failure with error message
- [ ] Component tests passing

**Story Points:** 2

---

### Story 3.4: Delete Todo

**As a** user, **I want** to delete a todo, **so that** I can remove finished or irrelevant tasks.

**Acceptance Criteria:**
- [ ] Delete button visible on each todo item
- [ ] Confirmation not required (simple click to delete)
- [ ] Optimistic removal from list
- [ ] Reverts on API failure with error message
- [ ] Component tests passing

**Story Points:** 1

---

### Story 3.5: Error Handling & States

**As a** user, **I want** clear feedback when something goes wrong, **so that** I know the app is still working.

**Acceptance Criteria:**
- [ ] Network errors show dismissible error banner
- [ ] Loading states for async operations
- [ ] Empty state when no todos exist
- [ ] Error state when initial fetch fails (with retry button)
- [ ] Component tests for each state

**Story Points:** 2

---

### Story 3.6: Responsive Design

**As a** user, **I want** the app to work on my phone, **so that** I can manage tasks anywhere.

**Acceptance Criteria:**
- [ ] Layout works from 375px to 1920px viewport width
- [ ] Touch-friendly tap targets (min 44px)
- [ ] No horizontal scrolling on mobile
- [ ] Readable text sizes on all viewports

**Story Points:** 2

---

## Epic 4: End-to-End Tests

### Story 4.1: E2E Test Suite

**As a** QA engineer, **I want** automated browser tests, **so that** all user journeys are verified.

**Acceptance Criteria:**
- [ ] Test: Create a new todo and verify it appears
- [ ] Test: Complete a todo and verify visual change
- [ ] Test: Delete a todo and verify removal
- [ ] Test: Empty state displays correctly
- [ ] Test: Multiple todos can be managed in sequence
- [ ] Test: Page refresh preserves data
- [ ] All tests pass in CI-compatible headless mode
- [ ] Minimum 5 passing tests

**Story Points:** 3

---

## Epic 5: Docker & Deployment

### Story 5.1: Backend Dockerfile

**As a** DevOps engineer, **I want** a production-ready backend container, **so that** the API can run anywhere.

**Acceptance Criteria:**
- [ ] Multi-stage build (deps → build → runtime)
- [ ] Non-root user
- [ ] Health check configured
- [ ] node:22-alpine base image
- [ ] Image builds successfully

**Story Points:** 2

---

### Story 5.2: Frontend Dockerfile

**As a** DevOps engineer, **I want** a production-ready frontend container, **so that** the SPA is served efficiently.

**Acceptance Criteria:**
- [ ] Multi-stage build (deps → build → nginx runtime)
- [ ] nginx:alpine for serving
- [ ] Nginx config proxies /api to backend
- [ ] Non-root user
- [ ] Health check configured
- [ ] Image builds successfully

**Story Points:** 2

---

### Story 5.3: Docker Compose Orchestration

**As a** developer, **I want** to run the full stack with one command, **so that** setup is trivial.

**Acceptance Criteria:**
- [ ] `docker-compose up` starts frontend + backend
- [ ] Backend data persisted via named volume
- [ ] Proper networking between services
- [ ] Environment variables for configuration
- [ ] Health checks for both services
- [ ] `docker-compose down` stops cleanly

**Story Points:** 2

---

## Epic 6: Quality Assurance

### Story 6.1: Test Coverage Analysis

**As a** QA engineer, **I want** coverage reports, **so that** I can identify untested code.

**Acceptance Criteria:**
- [ ] Coverage report generated for backend and frontend
- [ ] Minimum 70% meaningful coverage achieved
- [ ] Coverage gaps documented

**Story Points:** 1

---

### Story 6.2: Accessibility Audit

**As a** QA engineer, **I want** an accessibility audit, **so that** the app is usable by everyone.

**Acceptance Criteria:**
- [ ] Zero critical WCAG AA violations
- [ ] Proper semantic HTML (headings, landmarks, labels)
- [ ] Keyboard navigable
- [ ] Color contrast meets AA standards
- [ ] Audit results documented

**Story Points:** 2

---

### Story 6.3: Security Review

**As a** QA engineer, **I want** a security review, **so that** common vulnerabilities are caught.

**Acceptance Criteria:**
- [ ] No XSS vulnerabilities
- [ ] No SQL injection vulnerabilities
- [ ] Input validation on all endpoints
- [ ] No sensitive data exposure
- [ ] Findings documented

**Story Points:** 1

---

## Sprint Plan

| Sprint | Stories                      | Points |
|--------|------------------------------|--------|
| 1      | 1.1, 1.2, 2.1–2.5           | 13     |
| 2      | 3.1–3.6                      | 12     |
| 3      | 4.1, 5.1–5.3                 | 9      |
| 4      | 6.1–6.3                      | 4      |
| **Total** |                           | **38** |
