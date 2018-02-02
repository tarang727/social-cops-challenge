/* global module */
'use strict';

// Including the packages
const express = require('express');
let app = express();
const jwt = require('jsonwebtoken');

// Including the public files
const config = require('../config');

// Configuring the app
let PORT = config.PORT;
app.set('mysecret', config.secret);

// GET / route: Just for checking if the API is running or not.
app.get('/', (req, res) => {
  res.status(200).send(`The API is running at http://localhost:${PORT}/api. To access it, POST a username and password to http://localhost:${PORT}/login and you will get the signed token. Pass that token to 'x-access-token' header to GET http://localhost:${PORT}/api`);
});

// POST /login route
app.post('/login', (req, res) => {
  // TODO: use bcryptjs to hash the password
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    // both the parameters are present
    const payload = {
      user: {
        username,
        password
      }
    };
    // expiring the token in 10 days
    let token = jwt.sign(payload, app.get('mysecret'), {
      expiresIn: '10d'
    });
    res.status(200).json({
      success: true,
      token: token
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Please pass the username and password in the form.'
    });
  }
});

module.exports = app;
