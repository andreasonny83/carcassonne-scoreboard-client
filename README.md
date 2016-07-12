# Carcassonne Scoreboard (client)

[![Build Status](https://travis-ci.org/andreasonny83/carcassonne-scoreboard-client.svg?branch=master)](https://travis-ci.org/andreasonny83/carcassonne-scoreboard-client)

> Live version running at: [carcassonne-scoreboard-client.herokuapp.com](https://carcassonne-scoreboard-client.herokuapp.com)

## Install

### Introduction

Because this repository consists in the client side of the application only,
if you want to run the whole application in your own local environment,
you will need to download and run the server side first.

### Prepare your local environment

#### Get the code

First clone this repo to your local machine with:

```sh
git clone https://github.com/andreasonny83/carcassonne-scoreboard-client.git
```

Then, cd inside the project folder with:

```sh
cd !$
```

#### Install the dependencies

This project uses NodeJS, npm Bower and Gulp.
Make sure you have them installed on your machine before proceeding.

Then, install all the project's dependencies with:

```sh
npm install
```

This will install all the local dependencies the application
needs to run in development mode.

### Run your local project

If you have correctly installed all the dependencies,
you will now be able to run your local project simply with:

```sh
npm start
```

from inside the main `carcassonne-scoreboard-client` folder,
this command will trigger a gulp task responsible for initiate a local version
of the application and open a new tab in your browser to render the
`localhost:3000` where the application will be rendered.

### Configure the server side

The default server app is supposed to respond at: `http://localhost:5000`
however, if you want to use a different address to host your server app,
you can simply configure your `serverApp` variable with your custom preferences.

*The `serverApp` is located inside `src/app/config.js`.*

```javascript
angular
  .module('app')
  .constant('serverApp', {
    server : 'http://localhost',
    port   : 5000
  });
```

### Build a minified distribution version

```sh
npm run build
```

If present, gulp `usemin` will overwrite a `src/app/config.dist.js`
with `src/app/config.js` during the `build` and `deploy` tasks.
In this way you can simply clone your `src/app/config.js` to a new
`src/app/config.dist.js` in where storing your production information.

### Serve from the distribution folder

```sh
npm run serve:dist
```

This task will generate a new distribution project and will serve that using
local server.

## Contributing

We really appreciate your collaborations and feedbacks!

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Changelog

Changelog available [here][changelog-link]

## License

MIT © [Andrea Sonny](https://andreasonny.mit-license.org/2015-2016)

[changelog-link]: https://github.com/andreasonny83/carcassonne-scoreboard-client/blob/master/CHANGELOG.md
