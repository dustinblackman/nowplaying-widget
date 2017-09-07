interface SpotifyMockParams {
  url?: string;
}

export function createSpotifyMock(params: SpotifyMockParams) {
  return class SpotifyMock {
    createAuthorizeURL(spotifyPermissions: string[], name: string) {
      let url = params.url || "http://spotify.dev/authorize";
      url += `?permissions=${spotifyPermissions.join(",")}&state=${name}`;
      return url;
    }

    authorizationCodeGrant() {
      return Promise.resolve({
        body: {
          access_token: "access_token",
          refresh_token: "refresh_token",
          expires_in: 3600
        }
      });
    }

    setAccessToken() {
      return;
    }

    setRefreshToken() {
      return;
    }

    refreshAccessToken() {
      return this.authorizationCodeGrant();
    }

    getMyCurrentlyPlaying() {
      return Promise.resolve({
        body: {
          item: {
            id: "songid",
            name: "Aggressive",
            album: {
              name: "Aggressive",
              images: [
                {
                  url: "https://i.scdn.co/image/c4e0640d661385b44dd6c90642d94e456bf4a54e"
                }
              ]
            },
            artists: [
              {
                name: "Beartooth"
              }
            ]
          }
        }
      });
    }
  };
}
