const config = require("config");
const crypto = require("crypto");
const User = require("../User");
const app = require("../../server");

let server;

beforeAll(async () => {
  await User.collection.drop();
});

describe("username", () => {
  test("must be required", () => {
    const e = new User({}).validateSync();
    expect(e.errors.username.kind).toBe("required");
  });

  test("must be longer than 1 character", () => {
    const e = new User({ username: "a" }).validateSync();
    expect(e.errors.username.kind).toBe("minlength");
  });

  test("must be shorter than 30 characters", () => {
    const username = Array.from({ length: 31 }, () => "a").join("");
    const e = new User({ username }).validateSync();
    expect(e.errors.username.kind).toBe("maxlength");
  });

  test("must be lowercased", () => {
    const username = "TEST";
    expect(new User({ username }).username).toBe(username.toLowerCase());
  });

  test("must be trimmed", () => {
    const username = " test  ";
    expect(new User({ username }).username).toBe(username.trim());
  });

  test("must consist of alphanumeric characters", () => {
    const { errors: { username } } = new User({
      username: "@#$@%$^%!&*"
    }).validateSync();
    expect(username.kind).toBe("user defined");
    expect(username.message).toMatch(/alphanumeric characters/);
  });

  test("must be unique", async () => {
    const user1 = {
      username: "test",
      email: "test@mail.com",
      password: "123123"
    };
    const user2 = {
      username: "test",
      email: "random@mail.com",
      password: "234765"
    };
    const doc = await User.create(user1);
    return User.create(user2).catch(async e => {
      expect(e.code).toBe(11000);
      await doc.remove();
    });
  });
});

describe("email", () => {
  test("must be required", () => {
    const e = new User({}).validateSync();
    expect(e.errors.email.kind).toBe("required");
  });

  test("must be lowercased", () => {
    const email = "TEST@mAiL.com";
    expect(new User({ email }).email).toBe(email.toLowerCase());
  });

  test("must be trimmed", () => {
    const email = " test@gmail.com   ";
    expect(new User({ email }).email).toBe(email.trim());
  });

  test("must be a valid email", () => {
    const incorrect = new User({
      email: "wrong"
    }).validateSync();
    expect(incorrect.errors.email.name).toBe("ValidatorError");
    expect(incorrect.errors.email.kind).toBe("user defined");

    const correct = new User({ email: "test@gmail.com" }).validateSync();
    expect(correct.errors.email).toBeUndefined();
  });

  test("must be unique", async () => {
    const user1 = {
      username: "test1",
      email: "test@mail.com",
      password: "123123"
    };
    const user2 = {
      username: "test2",
      email: "test@mail.com",
      password: "234767"
    };
    const doc = await User.create(user1);
    return User.create(user2).catch(async err => {
      expect(err.code).toBe(11000);
      await doc.remove();
    });
  });
});

describe("firstName", () => {
  test("must be shorter than 30 characters", () => {
    const firstName = Array.from({ length: 31 }, () => "a").join("");
    const e = new User({ firstName }).validateSync();
    expect(e.errors.firstName.kind).toBe("maxlength");
  });

  test("must be trimmed", () => {
    const firstName = "  test    ";
    const doc = new User({ firstName });
    expect(doc.firstName).toBe(firstName.trim());
  });

  test("must consist of latin characters and dashes", () => {
    const e = new User({ firstName: "test#" }).validateSync();
    expect(e.errors.firstName.kind).toBe("user defined");
    expect(e.errors.firstName.message).toMatch(/alphanumeric characters/);
  });
});

describe("lastName", () => {
  test("must be shorter than 30 characters", () => {
    const lastName = Array.from({ length: 31 }, () => "a").join("");
    const e = new User({ lastName }).validateSync();
    expect(e.errors.lastName.kind).toBe("maxlength");
  });

  test("must be trimmed", () => {
    const lastName = "  test    ";
    const doc = new User({ lastName });
    expect(doc.lastName).toBe(lastName.trim());
  });

  test("must consist of latin characters and dashes", () => {
    const e = new User({ lastName: "test#" }).validateSync();
    expect(e.errors.lastName.kind).toBe("user defined");
    expect(e.errors.lastName.message).toMatch(/alphanumeric characters/);
  });
});

describe("password", () => {
  test("must be required", () => {
    const e = new User({ password: "" }).validateSync();
    expect(e.errors.password.name).toBe("CastError");
    expect(e.errors.password.reason.message).toMatch(/is required/);
  });

  test("must be at least 6 characters long", () => {
    const doc = new User({
      username: "test",
      email: "test@mail.com",
      password: "aaaaa"
    });
    const e = doc.validateSync();
    // console.log(e.errors.password);
    expect(e.errors.password.name).toBe("CastError");
    expect(e.errors.password.reason.message).toMatch(/at least 6 characters/);
  });

  test("hash is created and it is correct", () => {
    const password = "123123";
    const doc = new User({ password });

    const { length, iterations, algorithm } = config.get("crypto.hash");
    const controlHash = crypto
      .pbkdf2Sync(password, doc.salt, iterations, length, algorithm)
      .toString("base64");

    expect(doc.password).toBe(controlHash);
  });
});

describe("checkPassword method", () => {
  test("must return false if there is no password passed", () => {
    const doc = new User({
      username: "test",
      email: "test@gmail.com",
      password: "123123"
    });
    expect(doc.checkPassword("")).toBe(false);
  });

  test("must return true if the password is correct", () => {
    const password = "123123";
    const doc = new User({
      username: "test",
      email: "test@gmail.com",
      password
    });
    const { length, iterations, algorithm } = config.get("crypto.hash");

    expect(doc.checkPassword(password)).toBe(true);
  });
});
