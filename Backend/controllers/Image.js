'use strict';

var utils = require('../utils/writer.js');
var verifyToken = require('../utils/verifyToken.js');
var Image = require('../service/ImageService');

module.exports.getAllImages = function getAllImages (req, res, next) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  Image.getAllImages()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.uploadImage = function uploadImage (req, res, next) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  let description = req.body.description;

  Image.uploadImage({
    file: req.files[0],
    description: description,
    userId: userId,
  })
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
