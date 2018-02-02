/* global module */
'use strict';

// Including the packages.
const express = require('express');
let app = express();
const jwt = require('jsonwebtoken');

// Including the local files.
const config = require('../config');
app.set('mysecret', config.secret);

// The middleware function for authentication.
module.exports = (req, res, next) => {
  // check header, or url parameter, or post parameter
  const token = req.body.token || req.query.token || req.headers['token'];
  // decode token
  if (token) {
    // verifies secret and checks expiry
    jwt.verify(token, app.get('mysecret'), (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Incorrect Token. Authenticaion Failed.'
        });
      } else {
        // if things are good, save the dedoded in the req object and call next()
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    return res.status(400).send({
      success: false,
      message: 'No token provided.'
    });
  }
};
