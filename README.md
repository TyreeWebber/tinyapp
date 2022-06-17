# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Purpose
---
This is a project by [Tyree Webber](https://github.com/TyreeWebber) and was created as part of the [Lighthouse Labs](https://www.lighthouselabs.ca/) curriculum. It is not intended for professional use. ~~if you are using it for professional use please pay me i'm poor.~~

## Final Product
---
!["Screenshot of create URLs page"](https://github.com/TyreeWebber/tinyapp/blob/main/docs/createlink.png)

!["Screenshot of edit URLs page"](https://github.com/TyreeWebber/tinyapp/blob/main/docs/editurls.png)

!["Screenshot of login page"](https://github.com/TyreeWebber/tinyapp/blob/main/docs/login_page.png)

!["Screenshot of my URLs page"](https://github.com/TyreeWebber/tinyapp/blob/main/docs/myurls.png)

!["Screenshot of my URLs page without being a registered user"](https://github.com/TyreeWebber/tinyapp/blob/main/docs/nouser_urlsindex.png)

!["Screenshot of my URLs page as a registered user without any created URLs"](https://github.com/TyreeWebber/tinyapp/blob/main/docs/user_urlsindex.png)

## Dependencies
---
- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Dev Dependencies
---
- Mocha
- Chai
- Nodemon

## Getting Started
---
- Install all dependencies (using the `npm install` command).
- Add the following line into the scripts property of package.json `"start": "./node_modules/.bin/nodemon -L express_server.js"`.
- Run the development web server using the `npm start` command.

## File Structure & Descriptions
### Server Directory
---
#### [express_server.js](https://github.com/TyreeWebber/tinyapp/blob/main/express_server.js):
* Contains routing to endpoints with a path of /urls as well as user entry points.
* Requires all dependencies.
#### [helper_functions.js](https://github.com/TyreeWebber/tinyapp/blob/main/test/helpersTest.js):
* Contains helper functions for the project.
### Test Directory
---
#### [helpersTest.js](https://github.com/TyreeWebber/tinyapp/blob/main/test/helpersTest.js):
* contains unit tests for helper functions.
### Views Directory
#### [partials/_header.ejs](https://github.com/TyreeWebber/tinyapp/blob/main/views/partials/_header.ejs):
* Template for site header.
#### [error_page.ejs](https://github.com/TyreeWebber/tinyapp/blob/main/views/error_page.ejs):
* Template for errors.
#### [login_page.ejs](https://github.com/TyreeWebber/tinyapp/blob/main/views/login_page.ejs):
* Template for the login page.
#### [registration.ejs](https://github.com/TyreeWebber/tinyapp/blob/main/views/registration.ejs):
* Template for the registration page.
#### [urls_index.ejs](https://github.com/TyreeWebber/tinyapp/blob/main/views/urls_index.ejs):
* Template a collection of urls
#### [urls_new.ejs](https://github.com/TyreeWebber/tinyapp/blob/main/views/urls_new.ejs):
* Template for create new url page.
#### [urls_show.ejs](https://github.com/TyreeWebber/tinyapp/blob/main/views/urls_show.ejs):
* Template for update existing url page.