# AI Integration Log — Todo App

## Agent Usage

| Task                        | Agent/Persona | AI Assistance Level |
|-----------------------------|---------------|---------------------|
| PRD Refinement              | PM (John)     | Fully AI-generated from PRD input |
| Product Brief               | PM (John)     | Fully AI-generated  |
| Architecture Design         | Architect (Winston) | Fully AI-generated |
| Epics & Stories             | SM (Bob)      | Fully AI-generated with acceptance criteria |
| Test Strategy               | QA (Murat)    | Fully AI-generated  |
| Backend Implementation      | Dev (Amelia)  | Fully AI-generated, 1 fix needed (sort order) |
| Frontend Implementation     | Dev (Amelia)  | Fully AI-generated  |
| Unit/Integration Tests      | QA (Quinn)    | Fully AI-generated, all passing first run |
| E2E Tests                   | QA (Quinn)    | AI-generated, test runner required workaround |
| Docker Setup                | DevOps        | Fully AI-generated  |
| QA Reports                  | QA (Murat)    | Fully AI-generated  |

## BMAD Skills Used

The BMAD framework provided the persona-based workflow structure.
Skills available but process was driven autonomously through all
personas in a single session rather than invoking individual BMAD
skills interactively.

## MCP Server Usage

| Server               | Purpose                                    |
|----------------------|--------------------------------------------|
| Chrome DevTools MCP  | Available but not needed (tests passed)    |
| Playwright MCP       | Available but not needed directly           |

## Test Generation

### What AI Did Well

- Generated 22 backend integration tests covering all CRUD operations,
  validation, and edge cases — all passed on second run (first run caught
  a legitimate sort order bug)
- Generated 47 frontend component and hook tests with proper mocking
- Generated 10 E2E tests covering all user journeys
- Achieved 92%+ backend and 97%+ frontend statement coverage

### What AI Missed

- Initial backend test assumed `created_at DESC` would distinguish todos
  created in the same second — fixed by switching to `id DESC`
- Playwright test runner hangs in Claude Code sandbox environment —
  required custom test runner using Playwright API directly

## Debugging with AI

### Sort Order Bug

- **Problem:** `returns all todos newest first` test failed because two
  todos created in same second had identical `created_at` values
- **AI Detection:** Test failure output immediately identified the issue
- **AI Fix:** Changed `ORDER BY created_at DESC` to `ORDER BY id DESC`
  since AUTOINCREMENT guarantees sequential ordering

### Playwright Test Runner

- **Problem:** Playwright test runner CLI produced zero output and hung
  indefinitely in the Claude Code sandbox
- **Investigation:** AI verified browser launches work fine via Playwright
  API, isolated the issue to the test runner's worker process spawning
- **Solution:** Created `run-e2e.js` using Playwright library API directly.
  Standard `todo-app.spec.js` also provided for use outside the sandbox.

## Limitations Encountered

| Limitation                          | Impact | Workaround                     |
|-------------------------------------|--------|--------------------------------|
| Playwright test runner hangs in sandbox | Medium | Custom runner using Playwright API |
| Docker credential helper (wincred) | Low    | User needs to fix ~/.docker/config.json |
| Can't access ~/.docker/config.json | Low    | Documented fix for user         |
| Vite 6 + React plugin deprecation warnings | None | Cosmetic warnings only, no functional impact |
