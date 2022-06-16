const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generateRandomString = () => {
  let randomString = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const stringLength = 6;
  for (let i = 0; i < stringLength; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const urlsForUser = function(userID) {
  const filteredURLS = {};
  console.log(userID);
  for (let shortURL in urlDatabase) {
    if (userID === urlDatabase[shortURL].userID) {
      filteredURLS[shortURL] = urlDatabase[shortURL];
    }
    console.log("test:", filteredURLS);
  }
  return filteredURLS;
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["userID"]) {
    return res.redirect("/login");
  }
  const templateVars = {
    userID: req.cookies["userID"],
    user: users[req.cookies["userID"]],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  if (!req.cookies["userID"]) {
    return res.redirect("/login");
  }
  const templateVars = {
    urls: urlsForUser(req.cookies["userID"]),
    userID: req.cookies['userID'],
    user: users[req.cookies["userID"]],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  if (req.cookies["userID"] !== urlDatabase[shortURL].userID) {
    return res.send("You do not have the authorization to edit this."); 
  }
  const templateVars = {
    longURL: longURL,
    shortURL: shortURL,
    userID: req.cookies["userID"],
    user: users[req.cookies["userID"]],
  };
});

app.get("/users.json", (req, res) => {
  res.json(users);
});

app.get("/register", (req, res) => {
  const templateVars = {
    userID: req.cookies["userID"],
    user: users[req.cookies["userID"]],
  };
  res.render("registration", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  if (!req.cookies["userID"]) {
    return res.redirect("/login");
  }
  let shortURL = generateRandomString;
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies["userID"] };
  console.log(req.body);
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  for (const user in users) {
    if (users[user].email === email) {
      if (bcrypt.compareSync(password, users[user].password)){
        res.cookie("userID", users[user].id);
        return res.redirect("/urls");
      } else {
        return res.status(403).send("You have entered the wrong password.");
      }
    }
    return res.status(403).send("Account does not exist.");
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.cookies["userID"] !== urlDatabase[shortURL].userID) {
    return res.send("You are not authorized to edit this"); 
  }
  urlDatabase[shortURL].longURL = req.body.newURL;
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.cookies["userID"] === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls/");
  } else {
    res.send("You are not authorized to delete this");
  }
});

app.get("/login", (req, res) => {
  const templateVars = {
    userID: null,
    user: users[req.cookies["userID"]],
  };
  res.render("login_page", templateVars);
});


app.post("/logout/", (req, res) => {
  res.clearCookie("userID", users[req.cookies.userID]);
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('The email or password field waas left empty. Please enter your details and try again.');
  }
  for (const user in users) {
    if (users[user].email === email) {
      return res.status(400).send('You already have an account.');
    }
  };

  const ID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users[ID] = {
    id: ID,
    email: req.body.email,
    password: hashedPassword,
  };
  res.cookie("userID", ID);
  res.redirect("/urls");
});