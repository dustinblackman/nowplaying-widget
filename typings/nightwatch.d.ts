declare namespace Nightwatch {
  export interface TestSettings {
    username?: string;
    access_key?: string;
    launch_url?: string;
    selenium_port?: number;
    selenium_host?: string;
    silent?: boolean;
    desiredCapabilities: {
      browserName: string;
      marionette?: boolean
      build?: string;
      platform?: string;
      "tunnel-identifier"?: string;
    };
  }

  export interface Settings {
    src_folders: string[];
    output_folder: string;
    output: boolean;
    custom_commands_path: string;
    custom_assertions_path: string;
    page_objects_path: string;
    globals_path: string;
    selenium: {
      start_process: boolean;
      server_path?: string;
      port: number;
      cli_args?: {
        [k: string]: string;
      }
    };
    test_settings: {
      [k: string]: TestSettings;
    };
  }

  export interface Config {
    env: string;
    config: string;
    output: string;
    reporter: string;
    filter: string;
    _source: string[];
  }

  export interface Session {
    sessionId: string;
  }

  export interface Browser {
    currentTest: {
      name: string;
    };

    url(url: string): Browser;
    pause(time: number): Browser;
    waitForElementVisible(element: string, time: number): Browser;
    session(cb: (session: Session) => void): Browser;
    end(cb?: () => void): Browser;
  }
}

declare module "nightwatch" {
  export class CliRunner {
    public settings: Nightwatch.Settings;
    public manageSelenium: boolean;

    constructor(config: Nightwatch.Config);
    parseTestSettings(settings: Nightwatch.Settings): void;
    runTests(cb: () => void): void;
  }
}
