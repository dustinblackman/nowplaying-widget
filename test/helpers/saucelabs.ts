import * as Bluebird from "bluebird";
import * as R from "ramda";
import Saucelabs = require("saucelabs");

interface State {
  [sessionID: string]: {
    name: string;
    passed: boolean;
  };
}

// TODO Consider rate limiting outbound calls
// https://wiki.saucelabs.com/display/DOCS/Rate+Limits+for+the+Sauce+Labs+REST+API
const saucelabs = new Saucelabs({
  username: process.env.SAUCE_USERNAME || "",
  password: process.env.SAUCE_ACCESS_KEY || ""
});

const state: State = {};

export function registerTest(name: string) {
  return function(session: Nightwatch.Session) {
    state[session.sessionId] = {name, passed: false};
  };
}

export function completeTest(session: Nightwatch.Session) {
  if (!process.env.SAUCE_USERNAME) return;
  state[session.sessionId].passed = true;
  saucelabs.updateJob(session.sessionId, state[session.sessionId]);
}

export function submitFailedTests() {
  if (!process.env.SAUCE_USERNAME) return Bluebird.resolve();

  return Bluebird.each(R.keys(state), async sessionID => {
    if (!state[sessionID].passed) {
      await Bluebird.fromCallback(cb => saucelabs.updateJob(sessionID, state[sessionID], cb));
    }
  });
}
