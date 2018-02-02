/* global module */
'use strict';

// Including the packages.
const express = require('express');
let app = express();
let apiRoutes = express.Router();
const jsonpatch = require('json-patch');
const Jimp = require('jimp');

// Including the local files
const authenticate = require('../middlewares/authenticate');

// Configuring the app
app.use('/api', apiRoutes);
apiRoutes.use(authenticate); // all routes starting from /api will require authentication

// GET /api route: Returns the user object after decoding information from JWT
apiRoutes.get('/', (req, res) => {
  res.status(200).json( req.decoded );
});

// POST /api/apply_json_patch route
apiRoutes.post('/apply_json_patch', (req, res) => {
  const myObj = req.body.obj;
  const myPatch = req.body.patch;

  if (myObj && myPatch) {
    // both the inputs are provided.
    // safe to apply the patch.
    let result = jsonpatch.apply(myObj, myPatch);
    res.status(200).json(result);
    // jsonpatch.apply automatically handles the incorrect json patch arrays passed as input
  } else {
    res.status(400).json({
      success: false,
      message: 'Please pass the JSON object and JSON patch array.'
    });
  }
});

// POST /api/create_thumbnail route
apiRoutes.post('/create_thumbnail', (req, res) => {
  const imageUrl = req.body.imageUrl;
  if (imageUrl) {
    // parameter is present
    Jimp.read(imageUrl, (err, image) => {
      if (err || !image) {
        res.status(500).json({
          success: false,
          message: 'Unable to read the image from the url.'
        });
      } else {
        image.resize(50, 50).getBase64(Jimp.AUTO, (error, img) => {
          res.status(200).send(`<img src='${img}'>`);
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Please pass the imageUrl in the form.'
    });
  }
});

module.exports = app;
