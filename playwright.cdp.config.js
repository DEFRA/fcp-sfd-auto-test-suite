import { defineConfig } from '@playwright/test';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { bootstrap } from 'global-agent';
import baseConfig from './playwright.config.js';

// ---- HARDCODED PROXY ----
const dispatcher = new ProxyAgent({
  uri: 'http://localhost:3128', 
});
setGlobalDispatcher(dispatcher);
bootstrap();
global.GLOBAL_AGENT.HTTP_PROXY = 'http://localhost:3128';

// ---- CONFIG EXPORT ----
export default defineConfig({
  ...baseConfig,
  // No need to set baseURL here since your step definitions use full URLs
});
