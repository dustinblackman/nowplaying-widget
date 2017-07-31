declare module "uglifyjs-webpack-plugin" {
  let instance: UglifyJsPlugin.UglifyJsPluginInstance;
  export = instance;
}

declare namespace UglifyJsPlugin {
  export interface Configuration {
    comments?: RegExp | boolean;
    parallel?: {
      cache: boolean;
      workers: number;
    };
    uglifyOptions?: {
      compress: boolean;
      warnings: boolean;
    };
  }

  export interface UglifyJsPluginInstance {
    new(config: Configuration): UglifyJsPluginInstance // tslint:disable-line
  }
}
