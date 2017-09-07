import * as Bluebird from "bluebird";
import {exec} from "child_process";
import * as express from "express";
import * as fs from "fs";
import * as mockery from "mockery";
import {CliRunner as Nightwatch} from "nightwatch";
import * as path from "path";
import * as R from "ramda";
import * as selenium from "selenium-standalone";

import {createSpotifyMock} from "../test/helpers/mocks";
import * as saucelabs from "../test/helpers/saucelabs";

const seleniumInstall = Bluebird.promisify(selenium.install);

const seleniumConfig = {
  baseURL: "https://selenium-release.storage.googleapis.com",
  version: "3.4.0",
  drivers: {
    firefox: {
      version: "0.17.0",
      arch: process.arch,
      baseURL: "https://github.com/mozilla/geckodriver/releases/download"
    }
  }
};

const nightwatchConfig: Nightwatch.Settings = {
  src_folders: [path.join(__dirname, "../test/nightwatch")],
  output_folder: "reports",
  output: true,
  custom_commands_path: "",
  custom_assertions_path: "",
  page_objects_path: "",
  globals_path: "",
  selenium: {
    start_process: true,
    server_path: path.join(__dirname, "../node_modules/selenium-standalone/.selenium/selenium-server/3.4.0-server.jar"),
    port: 4445,
    cli_args: {
      "webdriver.gecko.driver": path.join(__dirname, "../node_modules/selenium-standalone/.selenium/geckodriver/0.17.0-x64-geckodriver"),
      "webdriver.chrome.driver": path.join(__dirname, "../node_modules/selenium-standalone/.selenium/chromedriver/2.31-x64-chromedriver")
    }
  },
  test_settings: {
    default: {
      launch_url: "http://google.com",
      selenium_port: 4445,
      selenium_host: "localhost",
      silent: true,
      desiredCapabilities: {
        browserName: "firefox",
        marionette: true, // TODO: What's this for?
        build: `nowplaying-travis-${process.env.TRAVIS_JOB_NUMBER}`,
        "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER
      }
    }
  }
};

// Additional tests to run when running on Saucelabs.
const sauceLabsTests = {
  "firefox windows": {
    desiredCapabilities: {
      browserName: "chrome",
      platform: "Windows 10"
    }
  },
  "chrome osx": {
    desiredCapabilities: {
      browserName: "chrome",
      platform: "OSX 10.12"
    }
  },
  "chrome windows": {
    desiredCapabilities: {
      browserName: "chrome",
      platform: "Windows 10"
    }
  },
  safari: {
    desiredCapabilities: {
      browserName: "safari"
    }
  },
  edge: {
    desiredCapabilities: {
      browserName: "MicrosoftEdge",
      platform: "Windows 10"
    }
  },
  ie: {
    desiredCapabilities: {
      browserName: "internet explorer",
      platform: "Windows 10"
    }
  },
  opera: {
    desiredCapabilities: {
      browserName: "opera",
      platform: "Windows 7"
    }
  }
};

// This is what gets passed to Nightwatch when using the CLI.
const runConfig = {
  env: "default",
  config: "./nightwatch.json", // This gets overwritten.
  output: "tests_output",
  reporter: "junit",
  filter: "",
  _source: []
};

async function runNightwatch(testName: string) {
  console.log(`Running nightwatch for ${testName}`);
  const runner = new Nightwatch(R.merge(runConfig, {env: testName}));
  runner.settings = nightwatchConfig;
  runner.manageSelenium = nightwatchConfig.selenium.start_process;
  runner.parseTestSettings(nightwatchConfig);

  await Bluebird.fromCallback(cb => runner.runTests(() => cb(null)));
  return saucelabs.submitFailedTests();
}

async function runTests() {
  if (!fs.existsSync(path.join(__dirname, "../node_modules/selenium-standalone/.selenium")) && !process.env.SAUCELABS_KEY) {
    console.log("Installing Selenium...");
    await seleniumInstall(seleniumConfig);
  }

  console.log("Setting up server");
  mockery.enable({warnOnReplace: false, warnOnUnregistered: false});
  mockery.registerMock("spotify-web-api-node", createSpotifyMock({url: "/.mock/authorize/callback"}));
  // TODO Add a flag here whether to use webpack or not.
  const app = require("../dist/server/server").app;
  app.get("/.mock/authorize/callback", (req: express.Request, res: express.Response) => {
    res.redirect(`/authorize/callback?code=123&state=${req.query.state}`);
  });

  console.log("Listening on 7000");
  const server = app.listen(7000);

  await Bluebird.map(
    R.keys(nightwatchConfig.test_settings),
    (testName: string) => {
      if (!process.env.SAUCE_USERNAME) return runNightwatch(testName);

      console.log(`Running ${testName}`);
      // TODO: Show output from Nightwatch, even if it's messy.
      return Bluebird.fromCallback(cb =>
        exec(
          `ts-node ${__filename}`,
          {
            env: R.merge(process.env, {NIGHTWATCH_TEST_NAME: testName})
          },
          cb
        )
      ).catch(err => {
        console.log(`Test ${testName} failed`);
        console.log(err);
      });
    },
    {concurrency: 4}
  );

  server.close();
}

async function start() {
  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    nightwatchConfig.test_settings.default.username = process.env.SAUCE_USERNAME;
    nightwatchConfig.test_settings.default.access_key = process.env.SAUCE_ACCESS_KEY;
    nightwatchConfig.test_settings = R.merge(nightwatchConfig.test_settings, sauceLabsTests);
    nightwatchConfig.test_settings.default.desiredCapabilities.platform = "OSX 10.12";
    nightwatchConfig.selenium = {
      start_process: false,
      port: 4445
    };
  }

  const testName: string = process.env.NIGHTWATCH_TEST_NAME || "";
  if (testName !== "") {
    await runNightwatch(testName);
  } else {
    await runTests();
  }
}

start()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
