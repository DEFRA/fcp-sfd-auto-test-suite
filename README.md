# fcp-sfd-auto-test-suite

Automated end-to-end test suite for the FCP SFD (Single Front Door) service, built with Playwright and Cucumber. Tests run against the deployed environment and cover the business and personal details journeys.

- [Local Development](#local-development)
  - [Requirements](#requirements)
    - [Node.js](#nodejs)
  - [Setup](#setup)
  - [Test Users and Environment Variables](#test-users-and-environment-variables)
  - [Running tests](#running-tests)
  - [Viewing reports](#viewing-reports)
- [Production](#production)
- [BrowserStack](#browserstack)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Local Development

### Requirements

#### Node.js

This project requires Node.js >= 22.13.1 (see package.json "engines"). Use nvm to manage versions.

To install dependencies and use the correct Node version:

```bash
# install Node via nvm (if needed) and switch to the repo version
nvm install 22.13.1
nvm use 22.13.1

# install dependencies
npm ci
```

A `.nvmrc` file is included at the repository root to make `nvm use` select the correct version automatically.

### Setup

Install dependencies:

```bash
npm install
```

### Test Users and Environment Variables

The suite runs at `parallel: 4` and requires a dedicated test user per worker to prevent login session conflicts and data contention. Users are selected automatically based on `CUCUMBER_WORKER_ID` (set by Cucumber for each parallel worker, values 0-3).

Three user types are required, four of each:

- **Standard** - full permissions, can view and amend all business and personal detail fields. Single business.
- **Amend** - amend permission level, can amend a subset of business fields. Must have multiple businesses associated.
- **View** - view only permission, cannot amend any fields. Must have multiple businesses associated.

Amend and view users must have **multiple businesses** associated with their CRN. Single-business users skip the business selection page after login, which causes the SBI-based selection step to time out.

The following environment variables must be set locally (e.g. in `~/.zshrc` or a `.env` file) and as CDP platform config for each environment.

**Standard users** (single business, full permissions)

| Worker | Variables                |
| ------ | ------------------------ |
| 1      | `USER_STANDARD_1_CRN`    |
| 2      | `USER_STANDARD_2_CRN`    |
| 3      | `USER_STANDARD_3_CRN`    |
| 4      | `USER_STANDARD_4_CRN`    |
| All    | `USER_STANDARD_PASSWORD` |

**Amend users** (multi-business, amend permission)

| Worker | Variables                              |
| ------ | -------------------------------------- |
| 1      | `USER_AMEND_1_CRN`, `USER_AMEND_1_SBI` |
| 2      | `USER_AMEND_2_CRN`, `USER_AMEND_2_SBI` |
| 3      | `USER_AMEND_3_CRN`, `USER_AMEND_3_SBI` |
| 4      | `USER_AMEND_4_CRN`, `USER_AMEND_4_SBI` |
| All    | `USER_AMEND_PASSWORD`                  |

**View users** (multi-business, view permission)

| Worker | Variables                            |
| ------ | ------------------------------------ |
| 1      | `USER_VIEW_1_CRN`, `USER_VIEW_1_SBI` |
| 2      | `USER_VIEW_2_CRN`, `USER_VIEW_2_SBI` |
| 3      | `USER_VIEW_3_CRN`, `USER_VIEW_3_SBI` |
| 4      | `USER_VIEW_4_CRN`, `USER_VIEW_4_SBI` |
| All    | `USER_VIEW_PASSWORD`                 |

**Environment**

| Variable      | Description                                       |
| ------------- | ------------------------------------------------- |
| `ENVIRONMENT` | Target environment, defaults to `test` if not set |

Test user permission levels are managed via CHS.

#### How worker isolation works

`CUCUMBER_WORKER_ID` is set automatically by Cucumber-JS for each parallel worker. The login helpers in `tests/helpers/helpers.js` read this value and index directly into an array of four users per type, so worker N always uses its own dedicated user. When running serially or as a single test (no worker ID set), it falls back to worker 0.

Chromium is launched once per worker. Each scenario gets a new browser context and page, which keeps cookies and session state isolated while avoiding a browser launch for every scenario.

### Running tests

Run the full suite (parallel, 4 workers):

```bash
npm run test
```

Run a single tagged scenario (useful for debugging):

```bash
npm run test -- --tags "@test36"
```

Run a single feature file:

```bash
npm run clean && npx cucumber-js features/businessDetailsPermissions.feature
```

### Accessibility tests

[axe-core](https://github.com/dequelabs/axe-core) scans run inside the existing journeys through `@axe-core/playwright`. They check WCAG 2.2 A and AA plus axe's `best-practice` rules.

Run only the accessibility scenarios:

```bash
npm run test:a11y
```

The scenarios in `features/accessibility.feature` cover the personal and business details journeys, including a validation error state. Scenarios for the normal change pages sign in with `I sign in as a standard user and open the "PersonalDetails" page`, which uses the same worker-based user as the rest of the suite (`USER_STANDARD_1..4_CRN`), so no two workers share a login.

The scenarios are tagged `@accessibility`, so `npm test` (which the CDP entrypoint runs) leaves them out until the known frontend defects are fixed or agreed as known issues.

#### Fix journey users

The fix journeys only work for users whose data fails validation, so these scenarios (tagged `@fix-user`) sign in as named users outside the worker rotation and the repair script. Both use `USER_STANDARD_PASSWORD`.

| User             | Variable                  | Data that fails validation | Pages                                 |
| ---------------- | ------------------------- | -------------------------- | ------------------------------------- |
| `PERSONAL_FIX_1` | `USER_PERSONAL_FIX_1_CRN` | Personal details           | `/personal-fix`, `/personal-fix-list` |
| `BUSINESS_FIX_1` | `USER_BUSINESS_FIX_1_CRN` | Business details           | `/business-fix`, `/business-fix-list` |

Don't point `PERSONAL_FIX_1` at one of `STANDARD_1..4`. Those need to stay valid for the main suite.

Several workers would end up signing in as the same fix user, so `npm run test:a11y` runs the normal scenarios in parallel first, then the `@fix-user` scenarios on one worker. If a fix user's data gets repaired, the scenarios fail with a message saying so instead of scanning the wrong page.

To look for users in a given data state, run `npm run find:test-users -- <crn-file> --limit 50`. It only reads: one sign-in per CRN, and it stops after 3 failed sign-ins in a row. It needs `USER_STANDARD_PASSWORD`, it's for test CRNs only, and it refuses to run against `prod`.

The fix scenarios don't save anything. The one exception is the address error scenario, which posts a postcode lookup and an empty address selection. Neither changes the record, because the address is only saved at the final check page.

Any new `USER_*_FIX_*_CRN` variable also has to be added to the CDP platform config before these scenarios can run there.

#### Running the helper unit tests

```bash
npm run test:unit
```

These check the known-issues validation and run the axe and keyboard helpers against small local pages in headless Chromium, so they don't need the Test environment or any user. They aren't part of the PR checks.

#### Adding a scan

To scan a page in any scenario, add this step after navigating to it:

```gherkin
Then the page should have no accessibility violations
```

Each scan attaches a JSON report to the Allure report. It lists the violations (rule, impact, selectors and help link), known issues and incomplete checks. A scenario fails if any violation is not a known issue.

#### Narrow screen and keyboard checks

`features/accessibilityResponsiveKeyboard.feature` (tagged `@accessibility @responsive-keyboard`) adds two more checks:

- `Then the page should have no accessibility violations on narrow screens` checks the page doesn't scroll horizontally at 320x568 and 568x320 (WCAG 1.4.10 Reflow), and runs axe once at 320x568. The landscape size is only checked for overflow.
- `Then the page should be fully operable with the keyboard` tabs through the page and checks that the skip link is the first stop after the cookie banner and works, focus is never trapped, every visible control is reachable and every focused control looks different from when it isn't focused. If the walk hits the 200 stop limit or focus jumps back to an earlier element, the check says so rather than guessing.

#### Known issues

Accepted violations are listed in `tests/helpers/accessibility-known-issues.js`. Each entry needs a `justification` and a Jira `ticket`, and can be limited to certain pages with `pathPattern`. The file is checked when it loads, so a bad entry fails straight away. Known issues still appear in the Allure report but do not fail the scenario.

Automated checks find only some accessibility problems. They do not replace manual testing with assistive technology: screen readers, speech recognition, 400% zoom and judging whether link text and error messages make sense still need a person.

### Repairing test user data

When the personal details interrupter is enabled, a test user whose personal details fail validation is sent to the `/personal-fix` journey instead of the individual change pages. Every personal details scenario on that user's worker then times out waiting for a form field, for example:

```
locator.clear: Timeout 30000ms exceeded.
  - waiting for locator('//input[@id="first"]')
```

Because scenarios are spread across four workers, the failures look random. Only the scenarios that ran on the affected worker fail.

`bin/fix-test-users.js` logs in as each configured test user and checks where the "Full name" link on `/personal-details` points. If it points to `/personal-fix`, the script completes the fix journey, filling only the fields the form shows with fixed valid values, and checks the link again.

Check which users are affected without changing anything:

```bash
set -a && source .env && set +a
npm run fix:test-users -- --dry-run
```

Repair all affected users:

```bash
npm run fix:test-users
```

Limit the run to named users:

```bash
npm run fix:test-users -- STANDARD_2 VIEW_4
```

Each user is reported as `OK`, `NEEDS FIX`, `FIXED`, `FAILED` or `ERROR`. The script exits with a non-zero code if any user is not valid at the end. Users whose credentials are not set are skipped.

The script overwrites the affected users' personal details in the shared environment. Check with the team before running it, in case a user's data has been made invalid on purpose to test the interrupter.

### Viewing reports

The suite uses Allure for reporting. Generate and open a report from the results of the last run:

```bash
npm run report
npx allure open allure-report
```

`npm run report:publish` generates the report and publishes it to S3 (used on CDP - locally the S3 step is skipped with a warning if `RESULTS_OUTPUT_S3_PATH` is not set).

## Production

Tests are run from the CDP Portal under the Test Suites section. Before changes can run, a new Docker image must be built. This happens automatically when a pull request is merged into `main`. You can check build progress under the Actions section of this repository — builds typically take 1-2 minutes.

The results of the test run are made available in the portal.

### Requirements of CDP Environment Tests

1. The service builds as a Docker container using `.github/workflows/publish.yml`. The workflow tags the Docker images so the CDP Portal can identify how the container should be run, and ensures it is published to the correct Docker repository.

2. The Dockerfile's entrypoint script should return exit code 0 if the suite passes, or a non-zero code if it fails.

3. Test reports are published to S3 using `./bin/publish-tests.sh`.

The environment the suite runs against is controlled by the `ENVIRONMENT` variable, which the base URL is derived from (`https://fcp-sfd-frontend.${ENVIRONMENT}.cdp-int.defra.cloud`). Defaults to `test`.

## BrowserStack

BrowserStack integration is in progress currently for cross-browser and cross-device runs. More information will be added once work is complete.

## Pre-commit hook

A [Husky](https://typicode.github.io/husky/) pre-commit hook runs [`sfd-id-check`](https://github.com/DEFRA/fcp-sfd-core/tree/main/scripts/check-synthetic-ids), which blocks commits that add real-looking CRNs or SBIs. Pull requests run the same check.

Enable the hook once per clone:

```bash
npm install
npm run setup:husky
```

Use synthetic identifiers only: CRNs from `9000000000` to `9999999999` and SBIs from `800000000` to `899999999`. If a flagged number isn't a CRN or SBI, such as a timestamp, add `sfd-id-check: allow` in a comment on the same line, or list it in `.sfd-id-check-allow`. See the [`sfd-id-check` README](https://github.com/DEFRA/fcp-sfd-core/tree/main/scripts/check-synthetic-ids) for details.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
