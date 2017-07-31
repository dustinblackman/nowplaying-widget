import * as R from "ramda";
import * as React from "react";
import { renderToString } from "react-dom/server";

import * as nconf from "./config";

interface Assets {
  manifests: string[];
  vendors: string[];
  app: string[];
}

function getAssets(fileExtension: string): string[] {
  const assets = require("../assets.json");
  return R.pipe(
    R.values,
    R.pluck(fileExtension),
    R.values
  )(assets) as string[];
}

// TODO: Need to do proper serverside rendering.
export default function renderApp() {
  let jsAssets = [`http://localhost:${nconf.get("PORT") + 1}/static/app.js`];
  let cssAssets: string[] = [];
  if (nconf.get("NODE_ENV") === "production") {
    cssAssets = getAssets("css");

    const assets: Assets = {
      manifests: [],
      vendors: [],
      app: []
    };
    getAssets("js").forEach(filePath => {
      if (filePath.includes("manifest")) return assets.manifests.push(filePath);
      if (filePath.includes("vendor")) return assets.vendors.push(filePath);
      assets.app.push(filePath);
      return;
    });
    const vals = R.values<string>(assets);
    jsAssets = R.flatten(vals);
  }

  const scriptTags = jsAssets.map(filePath => {
    return (<script src={filePath} />);
  });
  const styleTags = cssAssets.map(filePath => {
    return (<link rel="stylesheet" type="text/css" href={filePath} />);
  });

  return renderToString(
    <html>
      <head>
        <title>Now Playing</title>
        {styleTags}
      </head>
      <body>
        <div id="root" />
        {scriptTags}
      </body>
    </html>
  );
}
