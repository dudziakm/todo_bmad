# Todo App Implementation with BMAD

Goal: Apply Spec-Driven Development to build a complete, well-tested, and deployable application.

In this activity, you will use the BMAD Framework to drive the development of the full-stack Todo application described in the PRD below. This is where all roles converge: developers build the application, QA engineers ensure quality from day one, and DevOps engineers containerize and deploy.

**Why BMAD for this project?** BMAD provides a structured, agent-driven workflow that guides you from PRD through implementation. Its persona-based approach (PM, Architect, Developer, etc.) helps cross-functional teams understand their role in the spec-driven process and ensures comprehensive coverage of all project aspects.

Please note, the todo app is the suggested project to implement, but we're open to different applications as long as the methodology is used correctly. No matter which project you decide to complete, you will need to share it in the next step.

We have created a channel to support all learners on this pathway, please join #aine-training-support in slack to get additional support.

## Step 1: Initialize BMAD and Generate Specifications

Using the PRD as your input, work through BMAD's workflow to generate project artifacts:

- **Project Brief & PRD Refinement:** Use BMAD's PM persona to refine the PRD and create a detailed project brief
- **Architecture Design:** Use the Architect persona to define the technical architecture, API contracts, and component structure
- **Story Creation:** Break down the work into well-defined stories with acceptance criteria
- **Test Strategy:** Define test scenarios for unit, integration, and E2E tests as part of the story definitions

## Step 2: Build the Application (with QA Integration from Day One)

Use AI agents to implement the BMAD-generated specifications. QA activities are integrated throughout, not added at the end.

### Component: Project Setup

- **Implementation Task:** Initialize project structure using AI assistance. Create appropriate structure for frontend, backend, and tests.
- **QA Integration:** Set up test infrastructure immediately: Jest/Vitest for unit tests, Playwright for E2E tests. Configure test commands in package.json.

### Component: Backend

- **Implementation Task:** Build the API for CRUD operations on todos. Use AI to generate endpoints, validation, and error handling based on BMAD specs.
- **QA Integration:** Write integration tests for each API endpoint as you build them. Use Postman MCP or similar to validate API contracts.

### Component: Frontend

- **Implementation Task:** Build the UI for todo management. Use AI to generate components and state management based on BMAD specs.
- **QA Integration:** Write component tests as you build. Use Chrome DevTools MCP to debug and inspect during development.

### Component: E2E Tests

- **Implementation Task:** Create end-to-end tests covering all user journeys defined in stories.
- **QA Integration:** Use Playwright MCP to automate browser interactions. Cover: create todo, complete todo, delete todo, empty state, error handling.

## Step 3: Containerize with Docker Compose

Use Docker Compose to containerize and orchestrate your application.

| Task               | Description                                                                                                                                                                  |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Dockerfiles        | Create Dockerfiles for frontend and backend with multi-stage builds, non-root users, and health checks. AI should assist in generating optimized Dockerfiles.                |
| Docker Compose     | Create a docker-compose.yml that orchestrates all containers (app, database if needed). Include proper networking, volume mounts, and environment configuration.             |
| Health Checks      | Implement health check endpoints. Ensure containers report health status and logs are accessible via docker-compose logs.                                                    |
| Environment Config | Support dev/test environments through environment variables and compose profiles.                                                                                            |

## Step 4: Quality Assurance Activities

| QA Task                 | Description                                                                                                          |
|-------------------------|----------------------------------------------------------------------------------------------------------------------|
| Test Coverage           | Use AI to analyze test coverage and identify gaps. Target minimum 70% meaningful coverage.                           |
| Performance Testing     | Use Chrome DevTools MCP to analyze application performance. Document any issues found.                               |
| Accessibility Testing   | Run accessibility audits using Lighthouse or axe-core (can be automated via Playwright). Ensure WCAG AA compliance.  |
| Security Review         | Use AI to review code for common security issues (XSS, injection, etc.). Document findings and remediations.         |

## Deliverables for 4.2

- BMAD artifacts (project brief, architecture docs, stories with acceptance criteria)
- Working Todo application (frontend + backend or CLI)
- Unit, integration, and E2E test suites
- Dockerfiles and docker-compose.yml (application runs with `docker-compose up`)
- QA reports (coverage, accessibility, security review)
- Documentation of how BMAD guided the implementation

## AI Integration Documentation

Throughout Phase 3, maintain a log documenting:

- **Agent Usage:** Which tasks were completed with AI assistance? What prompts worked best?
- **MCP Server Usage:** Which MCP servers did you use? How did they help?
- **Test Generation:** How did AI assist in generating test cases? What did it miss?
- **Debugging with AI:** Document cases where AI helped debug issues.
- **Limitations Encountered:** What couldn't the AI do well? Where was human expertise critical?

## Success Criteria

| Criterion              | Target                                                       |
|------------------------|--------------------------------------------------------------|
| Phase 1-2 Deliverables | All activities completed with documented learnings           |
| Working Application    | Todo app fully functional with all CRUD operations           |
| Test Coverage          | Minimum 70% meaningful code coverage                         |
| E2E Tests              | Minimum 5 passing Playwright tests                           |
| Docker Deployment      | Application runs successfully via `docker-compose up`        |
| Accessibility          | Zero critical WCAG violations                                |
| Documentation          | README with setup instructions, AI integration log           |

---

Product Requirement Document (PRD) for the Todo App: [PRD.md](PRD.md)
