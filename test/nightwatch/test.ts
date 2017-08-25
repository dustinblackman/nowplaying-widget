import * as saucelabs from "../helpers/saucelabs";

export = {
  Index: (browser: Nightwatch.Browser) => {
    browser.session(saucelabs.registerTest(browser.currentTest.name))
      .url("http://localhost:7000")
      .pause(1000)
      .session(saucelabs.completeTest)
      .end();
  },
  "Now Playing": (browser: Nightwatch.Browser) => {
    browser.session(saucelabs.registerTest(browser.currentTest.name))
      .url("http://localhost:7000/user/test")
      .waitForElementVisible(".track", 5000)
      .pause(1000)
      .session(saucelabs.completeTest)
      .end();
  }
};
