'use strict';

var utils = require('../utils/writer.js');
const Image = require('../models/Image');
var fs = require('fs');
const path = require('path');
const detectFaces = require('../utils/detector');
const notifySubscribers = require('../utils/notifier');

/**
 * List all images
 * Returns metadata of all uploaded images.
 *
 * returns List
 **/
exports.getAllImages = function() {
  return new Promise(async function(resolve, reject) {
    try {
      const images = await Image.find().sort({ uploadedAt: -1 });
      const imageList = images.map(image => ({
        id: image._id,
        url: image.url,
        description: image.description,
        uploadedBy: image.uploadedBy,
        detectedPeopleCount: image.detectedPeopleCount,
        boundingBoxes: image.boundingBoxes,
        uploadedAt: image.uploadedAt
      }));
      resolve({images: imageList});
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Upload a new image
 * Uploads a new image, runs human detection, and notifies subscribers.
 *
 * returns inline_response_201_1
 **/
exports.uploadImage = function({ file, description, userId }) {
  return new Promise(async function(resolve, reject) {
    try {
      if (!file) {
        return reject(new Error('No image file provided.'));
      }

      let uploadPath;
      if (process.env.RUN_CONFIG === 'testing' || process.env.RUN_CONFIG === 'production') {
        uploadPath = '/uploads';
      }
      else {
        uploadPath = path.join(__dirname, '../uploads');
      }

      fs.mkdirSync(uploadPath, { recursive: true });

      const imagePath = path.join(uploadPath, `${Date.now()}-${file.originalname}`);
      
      fs.writeFileSync(imagePath, file.buffer);

      const newImage = new Image({
        url: `uploads/${path.basename(imagePath)}`, // Store relative path
        description : description || 'No description provided',
        uploadedBy: userId,
        detectedPeopleCount: 0, // Default value
        boundingBoxes: [], // Default value
      });

      await newImage.save();

      resolve(newImage._id);

      // Call detection asynchronously
      detectFaces(file.buffer)
        .then(detection => {
          newImage.detectedPeopleCount = detection.faces_detected;
          newImage.boundingBoxes = detection.bounding_boxes;
          newImage.save(); // Update the image document

          // Notify subscribers
          notifySubscribers(description, detection.faces_detected);
        })
        .catch(err => {
          console.error('Detection failed:', err.message);
        });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}

