'use strict';

var fs = require('fs');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
require('dotenv').config();

const express = require('express');
const app = express();

if (process.env.RUN_CONFIG === 'testing' || process.env.RUN_CONFIG === 'production') {
  app.use('/uploads', express.static('/uploads'));
}
else {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

var oas3Tools = require('oas3-tools');
var serverPort = 4080;

const urls = require('./config/urls')

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

app.use(cookieParser());

// Apply CORS middleware **before** the Swagger middleware
const corsOptions = {
    // Allow requests from the frontend based on the environment
    origin: urls.frontend,
    credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

// Based on the RUN_CONFIG environment variable, set the server url in the /api/openapi.yaml file
const yamlFile = fs.readFileSync('./api/openapi.yaml', 'utf8');
const newYaml = yamlFile.replace(
    /url: http:\/\/localhost:4080/g,
    `url: ${ urls.backend }`
);
fs.writeFileSync('./api/openapi.yaml', newYaml);

// Initialize the Swagger app with the specified configuration
var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);

// Attach Swagger middleware to the express app
var swaggerApp = expressAppConfig.getApp();

// Add Swagger routes to the app
app.use(swaggerApp);
app.listen(serverPort);
