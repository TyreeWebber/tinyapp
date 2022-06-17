const { assert } = require("chai");

const {
  getUserByEmail,
  urlsForUser,
  generateRandomString,
} = require("../helper_functions.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@test.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@test.com",
    password: "1234",
  },
};

const testUrlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" },
  "Sa4H9a": { longURL: "http://www.reddit.com/r/programmerhumor", userID: "userRandomID" }
};

describe("getUserByEmail", () => {
  it("should return a user with a valid email", function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });
  it('should return undefined when given an invalid email', function() {
    const user = getUserByEmail("use@example.com", testUsers);
    assert.isUndefined(user);
  });
});

describe("urlsForUser", () => {
  it("should return an object containing the URLs associated with the user's unique ID", function() {
    const urls = urlsForUser(testUrlDatabase,"userRandomID");
    const expectedOutput = {
      b2xVn2: {
        longURL: "http://www.lighthouselabs.ca",
        userID: "userRandomID",
      },
      Sa4H9a: { longURL: "http://www.espn.com", userID: "userRandomID" },
    };
    assert.deepInclude(urls, expectedOutput);
  });
  it("should return an empty object when given an id that has no urls attached to it", function() {
    const urls = urlsForUser("newUser", testUrlDatabase);
    const expectedOutput = {};
    assert.deepInclude(urls, expectedOutput);
  });
});

describe('generateRandomString', () => {
  it('should return an alphanumeric string 6 characters long', function() {
    const randomString = generateRandomString();
    const expectedOutput = 6;
    assert.strictEqual(randomString.length, expectedOutput);
  });
});