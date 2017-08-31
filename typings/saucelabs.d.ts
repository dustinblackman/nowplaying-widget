declare namespace Saucelabs {
  interface Config {
    username: string;
    password: string;
  }

  interface UpdateJobOptions {
    name: string;
    passed: boolean;
  }
}

declare module "saucelabs" {
  export = class Saucelabs {
    constructor(config: Saucelabs.Config);
    updateJob(sessionID: string, options: Saucelabs.UpdateJobOptions, cb?: (err: any) => void): void;
  };
}
