import * as path from "path";
import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";

import * as nconf from "../server/config";

const root = process.cwd();
const src = path.join(root, "src");
const port = nconf.get("PORT") + 1;
const ip = "0.0.0.0";

const babelQuery = {
  presets: [
    "react",
    ["es2015", {modules: false }],
    "stage-0"
  ],
  plugins: [
    "transform-decorators-legacy",
    "react-hot-loader/babel"
  ]
};

const config: webpack.Configuration = {
  devtool: "eval",
  context: src,
  entry: {
    app: [
      "react-hot-loader/patch",
      `webpack-dev-server/client?http://localhost:${port}`,
      "webpack/hot/only-dev-server",
      "./index.tsx"
    ]
  },
  output: {
    filename: "app.js",
    chunkFilename: "[name]_[chunkhash].js",
    path: path.join(root, "build"),
    publicPath: `http://localhost:${port}/static/`
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __PRODUCTION__: false,
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: [src, "node_modules"]
  },
  module: {
    loaders: [
      {
        test: /\.(png|j|jpeg|gif|svg|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000
          }
        }
      },
      {
        test: /\.tsx?$/,
        loaders: ["react-hot-loader/webpack", "ts-loader"]
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        query: babelQuery
      },
      {
        test: /\.css$/,
        use: [
          {loader: "style-loader"},
          {
            loader: "css-loader",
            options: {
              root: src,
              modules: false,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64:5]"
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {loader: "sass-loader"}
        ]
      }
    ]
  }
};

const devServerConfig = {
  publicPath: config.output && config.output.publicPath || "",
  // historyApiFallback: true,
  hot: true,
  headers: { "Access-Control-Allow-Origin": "*" }
};

new WebpackDevServer(webpack(config), devServerConfig)
  .listen(port, ip, (err: Error | null) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Webpack dev server listening on ${port}`);
  });
