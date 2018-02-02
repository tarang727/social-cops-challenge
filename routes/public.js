/* global module */
'use strict';

const express = require('express');
let app = express();
const jwt = require('jsonwebtoken');

const config = require('../config');

let PORT = config.PORT;
app.set('mysecret', config.secret);

app.get('/', (req, res) => {
  res.status(200).send(`The API is running at http://localhost:${PORT}/api. To access it, POST a username and password to http://localhost:${PORT}/login and you will get the signed token. Pass that token to 'x-access-token' header to GET http://localhost:${PORT}/api`);
});

app.post('/login', (req, res) => {
  // TODO: use bcryptjs to hash the password
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    const payload = {
      user: {
        username,
        password
      }
    };
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
