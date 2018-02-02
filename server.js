/* global module */
'use strict';

// Requiring the packages to be used
const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./config');

// Configuring the application
let PORT = config.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

const publicRoutes = require('./routes/public');
const protectedRoutes = require('./routes/protected');

// Setting up the ROUTES
app.use(publicRoutes);
app.use(protectedRoutes);

// Making the app ready for consumption.
app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});

module.exports = { app };
