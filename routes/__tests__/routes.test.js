const querystring = require("querystring");
const axios = require("axios");
const _ = require("lodash");
const config = require("config");
const app = require("../../server");
const User = require("../../models/User");

const port = config.get("port");
let server;

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    server = app.listen(port, resolve);
  });
});
afterAll(done => {
  server.close(done);
});

const host = `http://127.0.0.1:3001`;

const user = {
  username: "test",
  email: "test@mail.com",
  password: "123123",
  firstName: "Test",
  lastName: "User"
};

describe("login", () => {
  it("should redirect to /login if not authenticated", async () => {
    const request = axios(host, { maxRedirects: 0 });
    await expect(request).rejects.toThrow(/302/);
  });

  it("should log in the user and redirect to the main page if successful", async () => {
    const { data: loginForm, headers } = await axios.get(host);
    const _csrf = loginForm.match(/value="([A-Za-z0-9-_]{36})"/)[1];
    const cookie = headers["set-cookie"][0];

    if (_csrf.length !== 36) throw new Error("Token is incorrect");

    await User.create(user);

    // make a POST request
    const body = { _csrf, ...user };
    const { status: postStatus, data: postData } = await axios.post(
      `${host}/login`,
      querystring.stringify(body),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          cookie
        }
      }
    );

    expect(postStatus).toBe(200);
    expect(postData).toMatch("@test");

    // remove the test user
    await User.findOneAndRemove({ username: user.username });
  });
});

describe("registration", () => {
  it("should register the user and redirect to the main page", async () => {
    // first GET request

    const get1Res = await axios.get(`${host}/registration`);
    const _csrf = get1Res.data.match(/value="([A-Za-z0-9-_]{36})"/)[1];

    // POST request

    const bodyString = querystring.stringify({ _csrf, ...user });
    const redirRes = await axios.post(`${host}/registration`, bodyString, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        cookie: get1Res.headers["set-cookie"][0]
      },
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 303
    });

    // check redirection to the main page after the POST request
    expect(redirRes.status).toBe(302);
    expect(redirRes.headers.location).toBe("/");

    // check if the user was created in the DB
    expect(await User.find({ username: user.username })).toBeDefined();

    // second GET request

    const get2Res = await axios.get(host, {
      headers: {
        cookie: redirRes.headers["set-cookie"][0]
      },
      maxRedirects: 0
    });

    expect(get2Res.status).toBe(200);
    expect(get2Res.data).toMatch(`@${user.username}`);
  });
});
