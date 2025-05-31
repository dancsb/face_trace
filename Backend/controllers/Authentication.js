'use strict';

var utils = require('../utils/writer.js');
var Authentication = require('../service/AuthenticationService');

module.exports.userLogin = function userLogin (req, res, next, body) {
  Authentication.userLogin(body)
    .then(function (response) {

      res.cookie('jwt', response.token, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 weeks
        path: '/',
      });
      
      // Write the response body (if needed) to the client
      utils.writeJson(res, { message: 'Login successful' });
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userLogout = function userLogout (req, res, next) {
  Authentication.userLogout()
    .then(function (response) {

      res.clearCookie('jwt', {
        httpOnly: true,
        secure: true, // Set to true if using HTTPS
        maxAge: 0,
        path: '/',
      });

      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
