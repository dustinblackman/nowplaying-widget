# Now Playing Widget

![beartooth](http://i.imgur.com/nwb3squ.jpg)

[![David](https://img.shields.io/david/dustinblackman/nowplaying-widget.svg)](https://david-dm.org/dustinblackman/nowplaying-widget)
[![David](https://img.shields.io/david/dev/dustinblackman/nowplaying-widget.svg)](https://david-dm.org/dustinblackman/nowplaying-widget?type=dev)
[![Travis](https://img.shields.io/travis/dustinblackman/nowplaying-widget/master.svg)](https://travis-ci.org/dustinblackman/nowplaying-widget/builds)
[![Codecov](https://img.shields.io/codecov/c/github/dustinblackman/nowplaying-widget.svg)](https://codecov.io/gh/dustinblackman/nowplaying-widget)
[![Docker Hub](https://img.shields.io/docker/automated/dustinblackman/nowplaying-widget.svg)](https://hub.docker.com/r/dustinblackman/nowplaying-widget/)


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/dustinblackman/nowplaying-widget) [![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/?repo=https://github.com/dustinblackman/nowplaying-widget)

A Spotify Now Playing widget that's accessible with anything that can render a webpage. Users automatically register and
authorize by browsing to `/user/NAME` where they will be redirected to a Spotify authorization page, and then redirected
back to the render. Refreshes every 2 seconds by default. The original purpose of this project was to display the now
playing song on Twitch streams with OBS' browser view.

Design inspired by https://github.com/levifig/now-playing.widget

## Setup / Building From Source

Start by [creating an app on Spotify](https://developer.spotify.com/my-applications/#!/applications/create). After
creating, add the following __Redirect URIs__. `http://YOURDOMAIN.com/authorize/callback`. This can be set to
localhost if you wish to only use this locally, `http://localhost:PORT/authorize/callback`.

Run the following to install and compile to Javascript.

```bash
yarn install
yarn build
```

You'll find default configuration in `dist/server/config/default.js`. You can also make a local copy at `dist/server/config/local.js` that will override any defaults. Everything can be configured using the same keys in environment variables as well.

To start after configuration:

```
yarn start
```

Afterwards you can navigate to `http://YOURDOMAIN.com/user/NAME` and see it in action.

## Development

You can hack away with hot reloading enabled by executing `yarn dev`.

## Contributing

Contributions are welcome! Be sure to run `yarn test` before submitting any PRs.
