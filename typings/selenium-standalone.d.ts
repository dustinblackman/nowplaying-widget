declare module "selenium-standalone" {
  export interface InstallConfig {
    baseURL: string;
    version: string;
    drivers?: {
      chrome?: {
        version: string;
        arch: string;
        baseURL: string;
      };
      ie?: {
        version: string;
        arch: string;
        baseURL: string;
      };
      firefox?: {
        version: string;
        arch: string;
        baseURL: string;
      };
      edge?: {
        version: string;
      };
    };
  }

  export function install(config: InstallConfig): void;
}
