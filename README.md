# Carcassonne Scoreboard (client)

###### Live version running at: [carcassonne.sonnywebdesign.com](http://carcassonne.sonnywebdesign.com)

## Install

### Introduction

Because this repository consists in the client side of the application only, if you want to run the whole application in your own local environment, you will need to download and run the server side first.

### Prepare your local environment
#### Get the code

First clone this repo to your local machine with:

    git clone https://github.com/andreasonny83/carcassonne-scoreborad-client.git

Then, cd inside the project folder with:

    cd carcassonne-scoreborad-client

#### Install the dependencies
This project uses both Node Package Manager (npm) and Bower.

First make sure you have Node.js and npm installed. Then you will need to install globally gulp and bower, so run the following command line from your terminal:

    npm install -g gulp bower

From inside the `carcassonne-scoreborad-client` folder, run:

    npm install && bower install

This last command will install all the local dependencies the application will need to use in development mode.


### Run your local project

If you have correctly installed all the dependencies, you will now be able to run your local project simply with:

    gulp

from inside the main `carcassonne-scoreborad-client` folder,
this command will trigger a gulp task responsible for initiate a local version of the application and open a new tab in your browser to render the `localhost:3000` where the application will be rendered.

### Configure the server side

The default server app is supposed to respond at: `http://localhost:5000` however, if you want to use a different address to host your server app, you can simply configure your `serverApp` variable with your custom preferences.

** The `serverApp` is located inside `src/app/config.js`. **

    angular
      .module('app')
      .constant('serverApp', {
        server : 'http://localhost',
        port   : 5000
      });

If present, gulp `usemin` will overwrite a `src/app/config.dist.js` with `src/app/config.js` during the `build` and `deploy` tasks.
In this way you can simply clone your `src/app/config.js` to a new `src/app/config.dist.js` in where storing your production information.

## Changelog

### 1.0.4
- Scroll to top on view changes
- app/config.js exported containing the application variables
- Gulp updated to correctly compile config.js
- Tap to change selected player
- Other minor changes

### 1.0.3
- Filter the scores sent to the server side and accept only values > 0
- Lead player highlighted on the Scoreboard
- Some visual bug fixed on the scoreboard table
- Removed duplicated events from the socket factory
- Players e-mail removed for now
- Removed the `config.constants.js` never used
- Tabindex every where and accessibility improved
<br>
2016.01.10

### 1.0.2
- Make the socket service using some ServerApp variable to store the server side address.
<br>
2016.01.06

### 1.0.1
- First carcassonne-scoreborad-client using Socket.io to communicate to a carcassonne-scoreborad-server built in Node.js
<br>
2016.01.06

### 1.0.0
- First working version
- No server side yet
<br>
2015.12.28

### 0.0.1
- initial release<br>
2015.12.28
