#!/usr/bin/env node
"use strict";

const path = require('path');
const extend = require('util')._extend;
const baseDir = path.resolve(__dirname, '../');
const srcDir = path.resolve(baseDir);
// const source = require(srcDir + '/node_modules/shell-source');
const processes = require('./processes.js');
const isCi = process.argv[2] === '--ci';

const startTestApp = function(onStarted, options) {
  return processes.start({
    name: 'Testing App',
    command: 'meteor --port 3100',
    waitForMessage: 'App running at: http://localhost:3100',
    options: {
      cwd: srcDir,
      env: extend(process.env, options)
    }
  }, function() {
    console.log("Test app is running …");
    onStarted();
  });
};

const startChimpWatch = function() {
  processes.start({
    name: 'Chimp Watch',
    command: 'chimp .config/chimp.js --ddp=http://localhost:3100 --path=tests --watch --mocha --chai --browser=chrome',
    options: { cwd: baseDir }
  });
};

const startChimpCi = function() {
  var command = 'chimp .config/chimp.js --ddp=http://localhost:3100 --path=tests --browser=chrome --mocha --chai';
  processes.start({
    name: 'Chimp Once',
    command: command,
    options: { cwd: baseDir }
  });
};

// if (isCi) {
//   // CI mode -> run once
//   if (process.env.CIRCLECI) {
//     startTestApp(startChimpCi);
//   } else {
//     // Use a different db for local ci testing to avoid nuking of the dev db
//     startTestApp(startChimpCi, {
//       MONGO_URL: 'mongodb://localhost:3001/chimp_db'
//     });
//   }
// } else {
//   // DEV mode -> watch
//   startTestApp(startChimpWatch, {
//     MONGO_URL: 'mongodb://localhost:3001/chimp_db'
//   });
// }

// startTestApp(startChimpWatch, {
//     MONGO_URL: 'mongodb://localhost:3002/chimp_db'
// });

const watch = process.argv.slice(2)

if(watch){
    startTestApp(startChimpWatch, {
        MONGO_URL: 'mongodb://localhost:27017/chimp_db'
    })
}
else{
    startTestApp(startChimpCi)
}

