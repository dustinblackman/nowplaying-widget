declare module "spotify-web-api-node" {
  let instance: Spotify.SpotifyInstance;
  export = instance;
}

declare namespace Spotify {
  export interface Authorization { // TODO: Try removing all exports.
    body: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  }

  export interface CurrentSong {
    body: {
      item: {
        id: string;
        name: string;
        artists: [{
          name: string;
        }]
        album: {
          name: string;
          images: [{
            url: string
          }]
        }
      }
    };
  }

  export interface Config {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }

  export interface SpotifyInstance {
    new(config: Config): SpotifyInstance; // tslint:disable-line
    createAuthorizeURL(permissions: string[], state: string): string;
    authorizationCodeGrant(state: string): Promise<Authorization>;
    refreshAccessToken(): Promise<Authorization>;
    getMyCurrentlyPlaying(): Promise<CurrentSong>;
    setAccessToken(token: string): void;
    setRefreshToken(token: string): void;
  }
}
