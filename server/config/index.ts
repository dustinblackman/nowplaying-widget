import * as fs from "fs";
import * as nconf from "nconf";
import * as path from "path";
import * as R from "ramda";

import defaultConfig from "./defaults";

nconf.use("memory");
nconf.argv().env();
nconf.defaults(defaultConfig);

function loadConfigFromFile(filePath: string) {
  const localConfig = require(filePath).default;
  R.forEach((key: string) => {
    nconf.set(key, localConfig[key]);
  }, R.keys(localConfig));
}

if (fs.existsSync(path.join(__dirname, "local.ts")) && process.env.NODE_ENV !== "test") {
  loadConfigFromFile(path.join(__dirname, "local.ts"));
}

if (fs.existsSync(path.join(__dirname, "local.js")) && process.env.NODE_ENV !== "test") {
  loadConfigFromFile(path.join(__dirname, "local.js"));
}

if (process.env.NCONF_CONFIG_PATH) {
  // Config path must be based from the root of the project directory.
  const filePath: string = process.env.NCONF_CONFIG_PATH || "";
  loadConfigFromFile(path.join(__dirname, "../../", filePath));
}

export * from "nconf";
