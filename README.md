# Todo App — BMAD Method

A full-stack Todo application built using the [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) — a spec-driven, agent-powered development framework that guides projects from PRD through implementation with structured AI-assisted workflows.

## Overview

A simple, clean Todo app focused on core task management: create, view, complete, and delete tasks. Built with quality integrated from day one — not bolted on at the end.

| Feature             | Description                                               |
|---------------------|-----------------------------------------------------------|
| CRUD operations     | Create, read, update, delete todos                        |
| Persistent storage  | Data survives refreshes and sessions                      |
| Responsive UI       | Works across desktop and mobile                           |
| Visual status       | Completed tasks visually distinct from active ones        |
| Error handling      | Graceful failures on both client and server               |
| Dockerized          | Full stack runs via `docker-compose up`                   |

## Project Structure

```
todo_bmad/
├── _bmad/                  # BMAD framework configuration
│   ├── _config/            #   Agent and skill manifests
│   ├── bmm/                #   BMAD Method Modules (core skills)
│   ├── core/               #   Core modules (analysis, planning, solutioning, implementation)
│   └── tea/                #   Test Engineering Architecture (TEA) module
├── _bmad-output/           # Generated BMAD artifacts
│   ├── planning-artifacts/ #   Architecture docs, briefs, stories
│   ├── implementation-artifacts/
│   └── test-artifacts/
├── .cursor/skills/         # Cursor IDE BMAD skill integrations
├── .claude/skills/         # Claude Code BMAD skill integrations
├── .github/skills/         # GitHub Copilot BMAD skill integrations
├── docs/                   # Project documentation
├── PRD.md                  # Product Requirement Document
└── APP_IDEA.md             # Implementation guide and deliverables
```

## BMAD Workflow

The project follows a four-step spec-driven process:

1. **Specifications** — PM persona refines the PRD, Architect defines technical design, stories with acceptance criteria are created
2. **Implementation** — Backend API, frontend UI, and tests built in parallel following BMAD specs
3. **Containerization** — Dockerfiles with multi-stage builds, Docker Compose orchestration, health checks
4. **Quality Assurance** — Coverage analysis, performance testing, accessibility audits (WCAG AA), security review

## Getting Started

### Prerequisites

- Node.js 22 LTS
- Docker & Docker Compose
- An IDE with BMAD skills support (Cursor, VS Code with Claude Code, or GitHub Copilot)

### Development

```bash
# Clone the repository
git clone git@github.com:dudziakm/todo_bmad.git
cd todo_bmad

# TODO: Install dependencies (once implementation begins)
npm install

# TODO: Start development server
npm run dev
```

### Docker

```bash
# Run the full stack
docker-compose up

# Run with rebuild
docker-compose up --build
```

## Success Criteria

| Criterion           | Target                                             |
|---------------------|----------------------------------------------------|
| Working Application | All CRUD operations functional                     |
| Test Coverage       | Minimum 70% meaningful coverage                    |
| E2E Tests           | Minimum 5 passing Playwright tests                 |
| Docker Deployment   | Runs successfully via `docker-compose up`          |
| Accessibility       | Zero critical WCAG violations                      |

## Documentation

- [PRD.md](PRD.md) — Product Requirement Document
- [APP_IDEA.md](APP_IDEA.md) — Implementation guide, deliverables, and methodology

## BMAD Method

This project uses the [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) — a structured, agent-driven development framework with persona-based workflows (PM, Architect, Developer, QA, DevOps) that ensures comprehensive coverage from requirements through deployment.
