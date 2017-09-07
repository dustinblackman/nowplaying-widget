import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as helmet from "helmet";
import * as path from "path";
import * as R from "ramda";
import * as Spotify from "spotify-web-api-node";

import * as nconf from "./config";
import renderHTML from "./html";
import {ISpotifyCurrentSong} from "./interfaces";

interface ISpotifyInstances {
  [name: string]: Spotify.SpotifyInstance;
}

const spotifyInstances: ISpotifyInstances = {};
const spotifyPermissions = ["user-read-private", "user-read-email", "user-read-currently-playing", "user-read-playback-state"];
export const app = express();

function setRefreshInterval(name: string, expiresIn: number) {
  console.log(`Refreshing token for ${name} in ${(expiresIn - 100) * 1000} milliseconds`);
  setTimeout(() => {
    console.log(`Refreshing token for ${name}`);
    return spotifyInstances[name].refreshAccessToken().then(data => {
      spotifyInstances[name].setAccessToken(data.body.access_token);
      setRefreshInterval(name, data.body.expires_in);
    });
  }, (expiresIn - 100) * 1000);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());

if (nconf.get("NODE_ENV") === "production") {
  app.use("/static", express.static(path.join(__dirname, "../static")));
}

app.get("/", (_, res) => {
  res.send("Please set URL to /user/NAME to connect");
});

app.get("/user/:name", (req, res) => {
  const name = req.params.name;
  if (!spotifyInstances[name]) return res.redirect(`/authorize/${name}`);
  res.send(`<!DOCTYPE html>${renderHTML()}`);
});

app.get("/authorize/callback", (req, res) => {
  const name = req.query.state;
  if (!spotifyInstances[name])
    return res.status(500).json({
      msg: `${name} does not have an initialized spotify instance`
    });

  return spotifyInstances[name].authorizationCodeGrant(req.query.code).then(data => {
    spotifyInstances[name].setAccessToken(data.body.access_token);
    spotifyInstances[name].setRefreshToken(data.body.refresh_token);
    setRefreshInterval(name, data.body.expires_in);

    res.redirect(`/user/${name}`);
  });
});

app.get("/authorize/:name", (req, res) => {
  const name = req.params.name;
  spotifyInstances[name] = new Spotify({
    clientId: nconf.get("SPOTIFY_CLIENT_ID"),
    clientSecret: nconf.get("SPOTIFY_CLIENT_SECRET"),
    redirectUri: `${nconf.get("HOST")}/authorize/callback`
  });

  const callbackURL = spotifyInstances[name].createAuthorizeURL(spotifyPermissions, name);
  res.redirect(callbackURL);
});

app.get("/api/playing/:name", (req, res) => {
  const name = req.params.name;
  if (!spotifyInstances[name])
    return res.status(500).json({
      msg: `${name} does not have an initialized spotify instance`
    });

  return spotifyInstances[name].getMyCurrentlyPlaying().then(data => {
    const currentSong: ISpotifyCurrentSong = {
      id: data.body.item.id,
      song: data.body.item.name,
      album: data.body.item.album.name,
      album_art: data.body.item.album.images[0].url,
      artist: R.pluck("name", data.body.item.artists).join(", ")
    };
    res.json(currentSong);
  });
});
