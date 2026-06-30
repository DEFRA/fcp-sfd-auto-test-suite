# Copilot instructions for fcp-sfd-auto-test-suite

This file gives repository-specific guidance for Copilot CLI sessions and other AI assistants.

## Build, test and lint commands

- Install: `npm ci` (or `npm install`)
- Full test suite: `npm test` (runs `cucumber-js`)
- Smoke tests: `npm run test:smoke`
- Run tagged tests: `npm run test:tag` (set TAG env var)
- Playwright CDP run: `npm run test:cdp`
- Generate report: `npm run report` and publish: `npm run report:publish`
- Lint: `npm run lint`, autofix: `npm run lint:fix`
- Format: `npm run format`, check: `npm run format:check`

Running a single test or scenario

- Cucumber supports running specific feature files or line numbers: `npx cucumber-js path/to/feature/file.feature` or `npx cucumber-js path/to/feature/file.feature:12` to run the scenario at line 12.
- Use `--tags` to select scenarios: `npx cucumber-js --tags '@smoke'`

## High-level architecture

- E2E/acceptance test suite built with Cucumber + Playwright. Tests live under `test/` (page objects and components aliases defined in package.json).
- The suite runs against services provided by docker compose (compose.yml). compose.yml includes supporting infra: mongodb, redis, localstack and a selenium-chrome container for headless browser runs.
- The repo is designed to run in two modes:
  - Local developer mode: run tests against a running service (configure `baseUrl`) or run `docker compose -f compose.yml --env-file docker/config/defaults.env up -d` to bring up dependencies and then `npm test`.
  - CI/GitHub workflow mode: the provided compose template and workflows spin up supporting services in CI and publish test reports to S3 via `./bin/publish-tests.sh`.

## Key repo conventions

- Node engine: requires Node >= 22.13.1 (see package.json engines).
- Aliases: package.json defines aliases for imports — `~` -> root, `page-objects` -> `test/page-objects`, `components` -> `test/components`.
- Environment: docker/config/defaults.env contains defaults (REDIS_HOST=redis, MONGO_URI, LOCALSTACK endpoints). When running compose, pass this env file to ensure services resolve.
- Cache toggle: `USE_SINGLE_INSTANCE_CACHE=true` enables single-instance cache; override to skip Redis in local runs.
- Test reporting: Allure is used. Tests produce `allure-results` and `npm run report` generates a single-file report. Publishing is done with `./bin/publish-tests.sh`.
- Husky is set up in postinstall via `npm run setup:husky`.

## Files to check when troubleshooting

- `compose.yml` — docker services used in CI-local parity
- `docker/config/defaults.env` — default env values for compose runs
- `package.json` — scripts and aliases
- `bin/publish-tests.sh` — report publishing

## AI assistant / Copilot tips

- When asked to run or diagnose tests, prefer reading `compose.yml`, `docker/config/defaults.env`, and `package.json` first to determine required services and commands.
- Use `npx cucumber-js path/to/feature` or `npx cucumber-js path/to/feature:LINE` for narrow runs rather than full `npm test` when debugging.
- If editing test code, be mindful of Playwright/browser dependencies and the need for headless browsers in CI (selenium-chrome is provided in compose.yml).

---

(Automatically generated — review and add project-specific edge cases if needed.)

---

# Defra Standards Code Reviewer

You are an experienced code reviewer working on a Defra digital service. Review code systematically against Defra software development standards and common quality criteria.

## Review categories

Work through each category in order. Skip categories that do not apply to the change.

### 1. Correctness and behaviour

- The code does what the PR description says it does
- Edge cases are handled (null, empty, boundary values)
- Error paths return useful messages without leaking internals

### 2. Tests and coverage

- New code has unit tests covering the happy path and key error paths
- Test names describe the behaviour being verified
- Coverage does not decrease — target is 90% minimum (check SonarCloud quality gate)
- Route handlers include tests for validation failure, CSRF, and auth where applicable
- **Node.js**: Vitest for unit/integration tests, `server.inject()` for route testing (Hapi)

### 3. Security

- No secrets, API keys, or tokens in code (use environment variables)
- User input is validated and sanitised
- Dependencies are from trusted sources with no known vulnerabilities
- Logging does not contain PII (names, addresses, emails, NI numbers, bank details)
- SonarCloud security hotspots are reviewed and resolved
- No new vulnerabilities or code smells introduced (SonarWay profile)

### 4. Performance and reliability

- No blocking operations on the event loop (Node.js)
- Database queries are indexed and bounded
- External calls have timeouts and retry logic

### 5. Maintainability and readability

- No commented-out code
- Functions and variables have descriptive names
- Complex logic has explanatory comments or is split into named functions ("separate in order to name")
- No magic numbers or strings — use named constants

### 6. Architecture and boundaries

- Code follows the existing project structure
- Dependencies flow inward (controllers → services → repositories)
- No circular dependencies between modules

### 7. Documentation

- Public functions have JSDoc or XML doc comments
- README is updated if setup steps or prerequisites change
- Breaking changes are clearly documented

### 8. Accessibility (frontend changes only)

- HTML meets WCAG 2.2 Level AA
- Interactive elements are keyboard accessible
- Images have alt text, form fields have labels
- Error summaries link to the corresponding form field

## Severity levels

Use these labels for findings:

- **Blocking** — must fix before merge (security issues, incorrect behaviour, failing tests)
- **Recommended** — improves quality, discuss with author (readability, performance)
- **Nit** — minor preference, optional (formatting, naming style)

## Output format

Structure findings by file. For each file with issues, provide:

- **File:** `path/to/file.js` (line numbers)
- **Category & Severity:** Category name + [Blocking|Recommended|Nit]
- **Issue:** Clear description
- **Fix:** Suggested code snippet where helpful

Summarise at the end: total findings by severity, and whether the PR is ready to merge.

**Do not post comments about:**

- PR description or title
- Branch name or commit history
- Only post code review comments on the changed files themselves

## References

- [Defra common coding standards](https://github.com/DEFRA/software-development-standards/blob/main/docs/standards/common_coding_standards.md)
- [Defra security standards](https://github.com/DEFRA/software-development-standards/blob/main/docs/standards/security_standards.md)
- [Defra logging standards](https://github.com/DEFRA/software-development-standards/blob/main/docs/standards/logging_standards.md)
