const path = require('path');
const puppeteer = require('puppeteer');
const NodeEnvironment = require('jest-environment-node');
const fs = require('fs');
const os = require('os');
const server = require('./server.js').server;

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();

    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');

    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
    this.global.__SERVER__ = server();
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
