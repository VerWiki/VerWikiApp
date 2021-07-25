# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Frontend Config

Config/constants for the frontend has been centralized to `frontend/src/utils/config.js`, organized per component. Centralizing config/constants makes it easier to access the config from different files, as it eliminates the need to import tons of files just to use constants. Furthermore, different config files can be used in different environments (e.g. locally, in production etc) which makes our application more flexible. Using constants in general makes the codebase more readable and reduces duplication.

When developing in the frontend files, any new hardcoded values should be instead made as constants and be saved in the `frontend/src/utils/config.js` file in the appropriate object. New objects can be made for new components -> make sure to call Object.freeze upon initializing, as this prevents the config properties from being changed from other files. Each constant should also be documented.

# Getting started with the backend

The backend in this app runs with Python Flask, and connects to a mongoDB. The following steps should be helpful in the initial set up of the backend on your local machines:

1. Download and install MongoDB from [this link with instructions](https://docs.mongodb.com/manual/administration/install-community/)
2. _Optional_ After installing, you may want to follow [this tutorial](https://docs.mongodb.com/manual/tutorial/getting-started/#getting-started) to familiarize yourself with MongoDB. Some more detailed tutorials are [here](https://docs.mongodb.com/manual/core/databases-and-collections/)
   - This tutorial just uses the `mongo` shell; you can also optionally download a GUI for MongoDB [here](https://studio3t.com/download/)
3. Navigate to the `backend` folder in your terminal.
4. Initialize a Conda environment. Use the following commands:
   ```
   conda env create --file environment.yaml
   conda activate backend-env
   ```
5. Run `pre-commit install`.
6. Make sure that the MongoDB is running in port 27017 (should be already running from the installation instructions)
7. Initialize the DB and tables and populate the MongoDB with some initial data by running `python populate_db.py`.
8. You can also run the server locally by running `python server.py`.
9. The `black` python linter will be installed with the Conda environment. You can lint your code by running `black ./backend`. The linter will also be run automatically when you commit any Python files.
10. You can run all tests in the backend, with line coverage `pytest --cov-report term-missing --cov=path/to/backend/folder path/to/backend/folder`.

## Using Local Logger
To use the local logger:
1. Include the path to the logger folder by adding "sys.path.append(/path/to/logger/folder)"
2. Import Logger and Level by adding "from logger import Logger, Level"
3. To log, first create the logger ( logger = Logger("logger-name", level) )
4. The level can be chosen from Level.debug, Level.warning, Level.error, and Level.info
5. These are in order of importance. For example if the level is debug, then everything gets printed but if the level is error, then warning and debug messages are suppressed
6. To log a message, all you need to do is write "logger.error("The error message")"
7. You can switch "error" with the other levels in step above to give different messages.
8. The logs can now be found under the "logs" folder under the top backend folder.
