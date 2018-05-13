const cfenv = require("cfenv")

// export CF env vars for meteor
const mongoServiceName = 'sequent-db';
const appEnv = cfenv.getAppEnv()
process.env.ROOT_URL = appEnv.url;
process.env.MONGO_URL = appEnv.getService(mongoServiceName).credentials.uri;

// PORT is set correctly by cloud foundry

// launch the bundle's main.js
require('./bundle/main.js');