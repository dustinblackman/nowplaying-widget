import { expect } from "chai";
import * as mockery from "mockery";
import * as supertest from "supertest";

class SpotifyMock {
  createAuthorizeURL() {
    return "http://spotify.dev/authorize";
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
          name: "Song Name",
          album: {
            name: "Album Name",
            images: [{
              url: "http://spotify.dev/image.jpg"
            }]
          },
          artists: [{
            name: "Artist Name"
          }]
        }
      }
    });
  }
}

let request: supertest.SuperTest<supertest.Test>;
describe("Backend", () => {
  before(() => {
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false});
    mockery.registerMock("spotify-web-api-node", SpotifyMock);
    request = supertest(require("../server/server").app);
  });

  it("GET /", () => {
    return request
      .get("/")
      .set("Accept", "text/html")
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal("Please set URL to /user/NAME to connect");
      });
  });

  it("GET /user/test (before auth)", () => {
    return request
      .get("/user/test")
      .then((res) => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal("/authorize/test");
      });
  });

  it("GET /authorize/test", () => {
    return request
      .get("/authorize/test")
      .then((res) => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal("http://spotify.dev/authorize");
      });
  });

  it("GET /authorize/callback?state=test", () => {
    return request
      .get("/authorize/callback?state=test")
      .then(res => {
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal("/user/test");
      });
  });

  it("GET /user/test (after auth)", () => {
    return request
      .get("/user/test")
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.contain("Now Playing");
      });
  });

  // it("GET /api/playing/test", () => {
    // return request
      // .get("/api/playing/test")
      // .then((res) => {
        // expect(res.status).to.equal(200);
        // expect(res.body).to.equal({
          // id: "songid",
          // song: "Song Name",
          // album: "Album Name",
          // album_art: "http://spotify.dev/image.jpg",
          // artist: "Artist Name"
        // });
      // });
  // });
});
