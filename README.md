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

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
