//default port
const PORT = 8080;

//dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const { getUserByEmail, urlsForUser, generateRandomString } = require("./helper_functions");

//middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

//feed data
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$0J4eqL5cPAoGOZGI/VnSo./dw7PDAxOtG31SSWKn7s3M7YVTMXvaC",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$g1Eh4pYUfDbmih9/yEVa3OOrTVNgG1BLSJ3xXNs8nd0YVV9dkZJTu",
  },
};


//get route handlers
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//temporary endpoint
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//temporary endpoint to view current user
app.get("/users.json", (req, res) => {
  res.json(users);
});

//renders main page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(urlDatabase, req.session.userID),
    userID: req.session.userID,
    user: users[req.session.userID],
  };
  res.render("urls_index", templateVars);
});

//renders new url page, redirects if not signed in
app.get("/urls/new", (req, res) => {
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  const templateVars = {
    userID: req.session.userID,
    user: users[req.session.userID],
  };
  res.render("urls_new", templateVars);
});

//sends to shortURL page with edit and displays error code if tries to edit URL that does not belong to user
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    const templateVars = {
      user: users[req.session.userID],
      error: "Not a valid link",
    };
    return res.status(403).render("error_page", templateVars);
  }
  if (req.session.userID !== urlDatabase[shortURL].userID) {
    const templateVars = {
      user: users[req.session.userID],
      error: "You do not have the authorization to edit this",
    };
    return res.status(403).render("error_page", templateVars);
  }
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    longURL: longURL,
    shortURL: shortURL,
    user: users[req.session.userID],
  };
  res.render("urls_show", templateVars);
});

//manages shortURL link and redirects to corresponding longURL 
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//renders signup page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  res.render("registration", templateVars);
});

//renders login page
app.get("/login", (req, res) => {
  const templateVars = {
    userID: null,
    user: users[req.session.userID],
  };
  res.render("login_page", templateVars);
});

//redirects to error page if user tries to use a link that does not exist
app.get("*", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
    error: "IDK how you got here, please use one of the above links.",
  };
  return res.status(404).render("error_page", templateVars);
});

//adds random generated shortURL to URLs page and redirects user to login if they are not logged in
app.post("/urls", (req, res) => {
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.userID };
  res.redirect(`/urls/${shortURL}`);
});

//deletes existing URL if user is signed in and link belongs to the user
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls/");
  } else {
    const templateVars = {
      user: users[req.session.userID],
      error: "You do not have authorization to delete this",
    };
    return res.status(400).render("error_page", templateVars);
  }
});

//edits existing URL if user is signed in and link belongs to the user
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.userID !== urlDatabase[shortURL].userID) {
    return res.send("You are not authorized to edit this");
  }
  urlDatabase[shortURL].longURL = req.body.newURL;
  res.redirect("/urls/");
});

//checks for valid login credentials and redirects to the URL page if successful
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = getUserByEmail(email, users);
  if (!email || !password) {
    const templateVars = {
      user: users[req.session.userID],
      error: "You have left a field empty",
    };
    return res.status(400).render("error_page", templateVars);
  }
  if (!userID) {
    const templateVars = {
      user: users[req.session.userID],
      error: "An account does not exist",
    };
    return res.status(403).render("error_page", templateVars);
  }
  if (!bcrypt.compareSync(password, users[userID].password)) {
    const templateVars = {
      user: users[req.session.userID],
      error: "You have entered the wrong password.",
    };
    return res.status(403).render("error_page", templateVars);
  }
  req.session.userID = userID;
  return res.redirect("/urls");
});

//logs user out of account and deletes cookies
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//allows user to sign up for new account given account does not already exist
app.post("/register", (req, res) => {
  const email = req.body.email;
  if (!req.body.email || !req.body.password) {
    const templateVars = {
      user: users[null],
      error: "The email or password was left empty.",
    };
    return res.status(403).render("error_page", templateVars);
  }

  const userID = getUserByEmail(email, users);
  if (userID) {
    const templateVars = {
      user: users[null],
      error: "Account already exists.",
    };
    return res.status(400).render("error_page", templateVars);
  }

  const ID = generateRandomString();

  //converts plaintext password to a hashed pasword
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  users[ID] = {
    id: ID,
    email: req.body.email,
    password: hashedPassword,
  };
  req.session.userID = ID;
  res.redirect("/urls");
});

//port listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});