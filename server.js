/* global module */
'use strict';

// Including the packages to be used
const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Including the local files
const config = require('./config');
const publicRoutes = require('./routes/public');
const protectedRoutes = require('./routes/protected');

// Configuring the application
let PORT = config.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Setting up the ROUTES
app.use(publicRoutes);
app.use(protectedRoutes);

// Making the app ready for consumption.
app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});

module.exports = { app };
