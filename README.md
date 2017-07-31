# Now Playing Widget

![beartooth](http://i.imgur.com/nwb3squ.jpg)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/dustinblackman/nowplaying-widget) [![Deploy to Docker Cloud](https://files.cloud.docker.com/images/deploy-to-dockercloud.svg)](https://cloud.docker.com/stack/deploy/?repo=https://github.com/dustinblackman/nowplaying-widget)

A Spotify Now Playing widget that's accessable with anything that can render a webpage. Users automatically register and
authorize by browsing to `/user/NAME` where they will be redirected to a Spotify authorization page, and then redirected
back to the render. Refreshes every 2 seconds by default. The original purpose of this project was to display the now
playing song on Twitch streams with OBS' browser view.

Design inspired by https://github.com/levifig/now-playing.widget

## Setup / Building From Source

Start by [creating an app on Spotify](https://developer.spotify.com/my-applications/#!/applications/create). After
creating, add the following the __Redirect URIs__. `http://YOURDOMAIN.com/authorize/callback`. This can be set to
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
