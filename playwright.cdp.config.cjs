const { defineConfig } = require ('@playwright/test');
const { ProxyAgent, setGlobalDispatcher }= require ('undici');
const { bootstrap }= require ('global-agent');
const baseConfig= require ('./playwright.config.cjs');

// ---- HARDCODED PROXY ----
const dispatcher = new ProxyAgent({
  uri: 'http://localhost:3128', 
});
setGlobalDispatcher(dispatcher);
bootstrap();
global.GLOBAL_AGENT.HTTP_PROXY = 'http://localhost:3128';

// ---- CONFIG EXPORT ----
module.exports= defineConfig({
  ...baseConfig,
  // No need to set baseURL here since your step definitions use full URLs
});
