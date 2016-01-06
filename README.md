# Carcassonne Scoreboard (client)

###### Live version running at: [carcassonne.sonnywebdesign.com](http://carcassonne.sonnywebdesign.com)

## Install

### Introduction

Because this repository consists in the client side of the application only, if you want to run the whole application in your own local environment, you will need to download and run the server side first.

### Prepare the locale environment
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


## Changelog

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
