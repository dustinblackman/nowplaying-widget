declare module "assets-webpack-plugin" {
  let instance: AssetsPlugin.AssetsPluginInstance;
  export = instance;
}

declare namespace AssetsPlugin {
  export interface Configuration {
    path?: string;
    filename?: string;
  }

  export interface AssetsPluginInstance {
    new(config: Configuration): AssetsPluginInstance // tslint:disable-line
  }
}
