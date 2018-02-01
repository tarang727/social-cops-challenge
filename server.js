'use strict';

// process.env.NODE_ENV = 'dev';

// Requiring the packages to be used
const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jsonpatch = require('json-patch');
const Jimp = require('jimp');
// Requiring the files to be used
const config = require('./config');
// const User = require('./app/models/user');

// Configuring the application
let PORT = process.env.PORT || 8080;
let apiRoutes = express.Router();
app.set('mysecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);
app.use(morgan('dev'));

// The middleware for my API.
// All the API requests starting with /api will have to go through this middleware
apiRoutes.use((req, res, next) => {
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
});

// Setting up the ROUTES
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

// protected ROUTES
apiRoutes.get('/', (req, res) => {
  res.status(200).json( req.decoded );
});

apiRoutes.post('/apply_json_patch', (req, res) => {
  const myObj = req.body.obj;
  const myPatch = req.body.patch;

  if (myObj && myPatch) {
    let result = jsonpatch.apply(myObj, myPatch);
    res.status(200).json(result);
  } else {
    res.status(400).json({
      success: false,
      message: "Please pass the JSON object and JSON patch array."
    });
  }
});

apiRoutes.post('/create_thumbnail', (req, res) => {
  const imageUrl = req.body.imageUrl;
  if (imageUrl) {
    Jimp.read(imageUrl, (err, image) => {
      if (err || !image) {
        res.status(500).json({
          success: false,
          message: "Unable to read the image from the url."
        });
      } else {
        image.resize(50, 50).getBase64(Jimp.AUTO, (error, img) => {
          // if (error) {
          //   res.status(500).json({
          //     success: false,
          //     message: "Unable to resize image"
          //   });
          // } else {
            res.status(200).send(`<img src='${img}'>`)
          // } 
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Please pass the imageUrl in the form."
    });
  }
});

// Making the app ready for consumption.
app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});

module.exports = { app };