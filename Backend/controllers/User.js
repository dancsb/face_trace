'use strict';

var utils = require('../utils/writer.js');
var verifyToken = require('../utils/verifyToken.js');
var User = require('../service/UserService');

module.exports.emailConfirm = function emailConfirm (req, res, next, body) {
  User.emailConfirm(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userChangePassword = function userChangePassword (req, res, next, body) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  User.userChangePassword(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userCreate = function userCreate (req, res, next, body) {
  User.userCreate(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userDelete = function userDelete (req, res, next) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  User.userDelete(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userGet = function userGet (req, res, next) {
  const userId = verifyToken(req, res);
  if (!userId) return;

  User.userGet(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userGetById = function userGetById (req, res, next, userId) {
  const token_userId = verifyToken(req, res);
  if (!token_userId) return;

  User.userGetById(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userUpdate = function userUpdate (req, res, next, body) {
  const userId = verifyToken(req, res);
  if (!userId) return

  User.userUpdate(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
