'use strict';

const crypto = require('crypto');

var utils = require('../utils/writer.js');
const sendEmail = require('../utils/sendEmail');

const User = require('../models/User');
const ConfirmationToken = require('../models/ConfirmationToken');
const urls = require('../config/urls');

/**
 * Confirm user email address
 * Confirms a user email address based on a token sent via email.
 *
 * body User_email_confirm_body 
 * returns inline_response_200_1
 **/
exports.emailConfirm = function(body) {
  return new Promise(async function(resolve, reject) {
    const confirmationToken = await ConfirmationToken.findOne({ token: body.token });
    if (!confirmationToken) {
      return reject(utils.respondWithCode(404, { message: 'Token not found' }));
    }

    const user = await User.findById({ _id: confirmationToken.userId });
    if (!user) {
      return reject(utils.respondWithCode(404, { message: 'User not found' }));
    }

    if (confirmationToken.expiresAt < Date.now()) { 
      await confirmationToken.deleteOne();
      return reject(utils.respondWithCode(400, { message: 'Token expired' }));
    }

    user.isConfirmed = true;
    await user.save();

    await confirmationToken.deleteOne();

    resolve({ message: 'Email confirmed successfully' });
  });
}


/**
 * Change user password
 * Cahnges the password of an existing user.
 *
 * body User_change_password_body 
 * returns inline_response_200_1
 **/
exports.userChangePassword = function(body, userId) {
  return new Promise(async function(resolve, reject) {
    try {
      const { oldPassword, newPassword } = body;

      const user = await User.findById({ _id: userId });

      if (!user) {
        return reject(utils.respondWithCode(404, { message: 'User not found' }));
      }

      const oldPwdHash = crypto.createHash('sha512').update(user.pwdSalt + oldPassword).digest('hex');
      if (oldPwdHash !== user.pwdHash) {
        return reject(utils.respondWithCode(401, { message: 'Invalid password' }));
      }

      const pwdSalt = crypto.randomBytes(16).toString('hex');
      const pwdHash = crypto.createHash('sha512').update(pwdSalt + newPassword).digest('hex');

      user.pwdSalt = pwdSalt;
      user.pwdHash = pwdHash;
      await user.save();

      resolve({ message: 'Password changed successfully' });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Create a new user
 * Creates a new user account and sends a confirmation email.
 *
 * body User_body_1 
 * returns inline_response_201
 **/
exports.userCreate = function(body) {
  return new Promise(async function(resolve, reject) {
    try {
      const { username, email, password } = body;

      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return reject(utils.respondWithCode(409, { message: 'Username already exists' }));
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return reject(utils.respondWithCode(409, { message: 'Email already taken' }));
      }

      const pwdSalt = crypto.randomBytes(16).toString('hex');
      const pwdHash = crypto.createHash('sha512').update(pwdSalt + password).digest('hex');

      // Create a new user
      const newUser = new User({ username, email, password, pwdHash, pwdSalt });
      await newUser.save();

      //generate ConfirmationToken and send email
      const token = crypto.randomBytes(16).toString('hex');
      const newToken = new ConfirmationToken({ userId: newUser._id, token });
      await newToken.save();

      const activationLink = `${urls.frontend}/activate-account?token=${token}`;
      if (process.env.RUN_CONFIG === 'production') {
        sendEmail(username, email, activationLink);
    } else {
        console.log('Activate user:', activationLink);
      }

      resolve({
        id: newUser._id,
        message: 'User created successfully',
      });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Delete user account
 * Deletes a user account based on the userid.
 *
 * returns inline_response_200_1
 **/
exports.userDelete = function(id) {
  return new Promise(async function(resolve, reject) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: id });
      if (!deletedUser) {
        return reject(utils.respondWithCode(404, { message: 'User not found' }));
      }

      resolve({ message: 'User deleted successfully' });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Get leggoed in user
 * Returns the details of the authenticated user.
 *
 * returns User
 **/
exports.userGet = function (id) {
  return new Promise(async function (resolve, reject) {
    try {
      const user = await User.findById({ _id: id });
      if (!user) {
        return reject(utils.respondWithCode(404, { message: 'User not found' }));
      }

      resolve({
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Get user by Id
 * Returns the details of a user.
 *
 * userId String ID of the user to query
 * returns User
 **/
exports.userGetById = function(userId) {
  return new Promise(async function(resolve, reject) {
    try {
      const user = await User.findById({ _id: userId });

      if (!user) {
        return reject(utils.respondWithCode(404, { message: 'User not found' }));
      }

      resolve({
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    }
    catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}


/**
 * Update user account
 * Updates the details of an existing user.
 *
 * body User_body 
 * returns inline_response_200_1
 **/
exports.userUpdate = function(body, id) {
  return new Promise(async function(resolve, reject) {
    try {
      const { username, email } = body;

      // Update the user details
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { username },
        { email },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        return reject(utils.respondWithCode(404, { message: 'User not found' }));
      }

      resolve({ message: 'User updated successfully' });
    } catch (err) {
      reject(utils.respondWithCode(500, { message: err.message }));
    }
  });
}

