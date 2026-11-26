import { createRequire } from 'node:module'

// The BrowserStack SDK's generated Playwright config calls require(), which is
// not defined in an ES module project.
globalThis.require = createRequire(import.meta.url)
