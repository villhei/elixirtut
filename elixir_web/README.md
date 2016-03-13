# Web-frontend project for the Elixir tutorial

The page is deployed at [the tutorial main page](http://www.darkmatter.nu/elixir/).

Depends on NodeJS, versions might vary.

## Installing webpack
```bash
npm install -g webpack webpack-dev-server
```
## Running in development mode
```bash
$ npm install 
$ npm start
```

Webpack dev server will serve the project at http://localhost:8080/webpack-dev-server

## Building for production
```bash
$ webpack -p
```

The project will be deployed in /dist folder, ready to move in to the production server.