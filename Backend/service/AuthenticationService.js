'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

var utils = require('../utils/writer.js');

const User = require('../models/User');

/**
 * User login and JWT token issuance
 * Authenticates the user and returns a JWT token if credentials are correct.
 *
 * body Auth_login_body 
 * no response value expected for this operation
 **/
exports.userLogin = function(body) {
  return new Promise(async function(resolve, reject) {
    const existingUser = await User.findOne({ email: body.email });
    if (!existingUser) {
      return reject(utils.respondWithCode(404, { message: 'User not found' }));
    }

    if (!existingUser.isConfirmed) {
      return reject(utils.respondWithCode(403, { message: 'Email not confirmed' }));
    }

    const pwdHash = crypto.createHash('sha512').update(existingUser.pwdSalt + body.password).digest('hex');
    if (pwdHash !== existingUser.pwdHash) {
      return reject(utils.respondWithCode(401, { message: 'Invalid password' }));
    }

    // Generate JWT token
    const token = jwt.sign({ userId: existingUser._id }, jwtSecret, { expiresIn: '2w' });

    resolve({ token });
  });
}


/**
 * Logout user
 * Invalidate the current session
 *
 * returns inline_response_200
 **/
exports.userLogout = function() {
  return new Promise(function(resolve, reject) {
    try {
      resolve({ message: 'Successfully logged out' });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}

