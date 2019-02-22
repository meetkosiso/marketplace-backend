# shopapi

### Status
[![Build Status](https://travis-ci.org/bezopteam/marketplace-backend.svg?branch=master)](https://travis-ci.org/bezopteam/marketplace-backend)

1. Clone the Repo

> git clone https://github.com/bezopteam/marketplace-backend.git

2. Install Dependencies

> npm install

3. Start the App

> npm start

4. Test the App

> npm test

5. Build and Serve App

> npm serve


## Deploy to Heroku

$ heroku login
$ heroku git:clone -a bshop-api
$ cd bshop-api

Alternative 

$ heroku git:remote -a bshop-api
$ heroku info --app bshop-api

Deploy your changes
Make some changes to the code you just cloned and deploy them to Heroku using Git.

$ git add .
$ git commit -am "make it better"
$ git push heroku master

## Dependencies
-Listing query strings - q, page, limit, fields etc. already provided by querymen
-Query string validator - Using querymen
-Request body validator - Using bodymen
-Standard error responses - Using querymen and bodymen error handlers
-Unit and integration tests - Using Jest
-Continuous integration support - Using Travis CI
-API docs generator - Using apidoc

src/api/

Here is where the API endpoints are defined. Each API has its own folder.
src/api/some-endpoint/model.js

It defines the Mongoose schema and model for the API endpoint. Any changes to the data model should be done here.
src/api/some-endpoint/controller.js

This is the API controller file. It defines the main router middlewares which use the API model.
src/api/some-endpoint/index.js

This is the entry file of the API. It defines the routes using, along other middlewares (like session, validation etc.), the middlewares defined in the some-endpoint.controller.js file.
services/

Here you can put helpers, libraries and other types of modules which you want to use in your APIs.