import * as path from "path";
import * as webpack from "webpack";

import * as AssetsPlugin from "assets-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as UglifyJSPlugin from "uglifyjs-webpack-plugin";

const root = process.cwd();
const build = path.join(root, "dist/static");
// TODO: look for a way to automate this.
const vendor = ["axios", "bluebird", "ramda", "react", "react-dom", "react-redux", "react-fittext", "redux"];

const babelQuery = {
  presets: ["react", ["es2015", {modules: false}], "stage-0"],
  plugins: ["transform-decorators-legacy"]
};

const config: webpack.Configuration = {
  context: root,
  entry: {
    app: ["./src/index.tsx"],
    vendor
  },
  output: {
    filename: "[name]_[chunkhash].js",
    chunkFilename: "[name]_[chunkhash].js",
    path: build,
    publicPath: "/static/"
  },
  node: {
    dns: "mock",
    net: "mock"
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin("[name]_[contenthash:5].css"),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"],
      minChunks: Infinity
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 50000}),
    new UglifyJSPlugin({
      comments: false,
      uglifyOptions: {
        compress: true,
        warnings: false
      }
    }),
    new AssetsPlugin({path: path.join(build, ".."), filename: "assets.json"}),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __PRODUCTION__: true,
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    modules: ["node_modules"],
    unsafeCache: true
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
        use: [{loader: "babel-loader", query: babelQuery}, {loader: "ts-loader"}]
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
              root,
              modules: false,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64:5]"
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  }
};

webpack(config, (err, stats) => {
  if (err) return console.log(err);
  console.log(stats.toString());
});
