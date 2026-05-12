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
