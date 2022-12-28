# YelpCamp

[YelpCamp](https://webdev-yelpcamp-sherry-xzhu.herokuapp.com/) is a full-stack web-based application using RESTful APIs and MongoDB database, which promotes crowd-sourced reviews and photos about local campgrounds.

### Stack

Node.js, Express.js, MongoDB

### Environment & Setup

- Run `npm install` to download all dependencies from package.json.
- Create a `.env` file in the root of project directory, template code is given in `.env-template`.

### Features

#### Authentication

- User login with username and password
- Admin sign up with admin code

#### Authorization

- One cannot manage posts and without being authenticated
- One cannot edit or delete posts and comments created by other users
- Admin can manage all posts and comments

#### Users

- View campgrounds available
- Sign up account with credentials
- Login with credentials
- Create, post, edit, and comment on campgrounds
- Remove own posts and comments
- Reset password through a link sent to user's email
- Look up campgrounds using fuzzy search box
- View user profiles
- Flash messages responding to users' interaction with the app

#### Campgrounds

- View a variety of campgrounds on home page
- Select individual campgrounds for further information
- Each campground has a name, author, description, image, location, price, timestamp since created, and associated comments
- Each campsite location is rendered using a Google Maps API plugin

#### Webpage

- Responsive web design that automatically adjusts for different screen sizes

### Technology

#### Platform

- [GoormIDE](https://ide.goorm.io/) - an online integrated development environment
- [Heroku](https://www.heroku.com/) - a cloud platform that runs apps in virtual containers

#### Front-end

- [JavaScript](https://www.javascript.com/) - high-level, interpreted programming language
- [HTML](https://en.wikipedia.org/wiki/HTML) - standard markup language for creating web pages and web applications
- [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) - style sheet language used for describing the presentation of a document written in a markup language like HTML
- [EJS](https://ejs.co/) - templating language that generates HTML markup with plain JavaScript
- [Bootstrap 4](https://getbootstrap.com/) - an open-source toolkit for developing with HTML, CSS, and JS
- [jQuery](https://jquery.com/) - cross-platform JavaScript library designed to simplify the client-side scripting of HTML

#### Back-end

- [Node.js](https://nodejs.org/en/) - JavaScript run-time environment that executes JavaScript code server-side
- [Express.js](https://expressjs.com/) - minimalist web framework for Node.js
- [mongoDB](https://www.mongodb.com/) - open-source cross-platform document-oriented database program
- [mongoose.js](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [moment.js](https://momentjs.com/) - parse, validate, manipulate, and display dates and times in JavaScript
- [node-geocoder](https://www.npmjs.com/package/node-geocoder) - Node.js library for geocoding and reverse geocoding

#### Middleware

- [express-session](https://www.npmjs.com/package/express-session) - session middleware for Express.js
- [passport.js](http://www.passportjs.org/) - authentication for Node.js
- [connect-flash](https://www.npmjs.com/package/connect-flash) - flash message middleware for Connect and Express.js
- [body-parser](https://www.npmjs.com/package/body-parser) - Node.js body parsing middleware

### Source

The Web Developer Bootcamp on Udemy by Colt Steele and Ian Schoonover
