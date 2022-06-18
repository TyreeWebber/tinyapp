const getUserByEmail = function (email, users) {
  for (const userID in users) {
    if (users[userID].email === email) {
      return userID;
    }
  }
  return;
};

const urlsForUser = function (urlDatabase, userID) {
  const filteredURLS = {};
  for (let shortURL in urlDatabase) {
    if (userID === urlDatabase[shortURL].userID) {
      filteredURLS[shortURL] = urlDatabase[shortURL];
    }
  }
  return filteredURLS;
};

const generateRandomString = () => {
  let randomString = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const stringLength = 6;
  for (let i = 0; i < stringLength; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

module.exports = { 
  getUserByEmail,
  urlsForUser,
  generateRandomString,
};