import { expect } from "chai";
import * as mockery from "mockery";
import * as supertest from "supertest";

import { createSpotifyMock } from "./helpers/mocks";

let request: supertest.SuperTest<supertest.Test>;
describe("Backend", () => {
  before(function() {
    this.timeout(10000);
    mockery.enable({warnOnReplace: false, warnOnUnregistered: false});
    mockery.registerMock("spotify-web-api-node", createSpotifyMock({}));
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
        expect(res.header.location).to.equal("http://spotify.dev/authorize?permissions=user-read-private,user-read-email,user-read-currently-playing,user-read-playback-state&state=test");
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

  it("GET /api/playing/test", () => {
    return request
      .get("/api/playing/test")
      .then((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          id: "songid",
          song: "Aggressive",
          album: "Aggressive",
          album_art: "https://i.scdn.co/image/c4e0640d661385b44dd6c90642d94e456bf4a54e",
          artist: "Beartooth"
        });
      });
  });
});
