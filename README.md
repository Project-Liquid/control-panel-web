# control-panel-web
React-based user interface for communicating with the engine via a serial port and websockets

Uses [create-react-app](https://create-react-app.dev/).

## Usage
Clone the repository. From the repository folder, run:
```
python static_server.py
```
This will run the most recent build, which does necessarily reflect changes made to the source code. If you want to edit this project, follow instructions below.

## Editing this project
Clone the repository and then run `npm install` from inside the folder (this might take a while). Once installation is done, run `npm start` to run the dev server. You should probably be doing this on a mac or linux computer.

This project is currently in development. Its job is to send text-based commands over a websockets connection. If you want to work on the project, make sure a websockets server is running with a connection to the backend (see [websockets-serial](https://github.com/Project-Liquid/websockets-serial) which relays the commands over a serial port) and start by looking at the code in the `src` folder. The entry point is `src/index.js`.

Running `npm start` will let you run the project in its current state. Running `npm build` will update your changes to the `build` folder, which is where `static_server.py` serves the built product from.