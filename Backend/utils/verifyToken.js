'use strict';

const jwt = require('jsonwebtoken');
var utils = require('../utils/writer.js');
const jwtSecret = process.env.JWT_SECRET;

module.exports = function verifyToken(req, resOrWs) {
  const token = req.cookies.jwt;

  if (!token) {
    if (resOrWs instanceof require('http').ServerResponse) {
      utils.writeJson(resOrWs, { message: 'No token provided' }, 403);
    } else {
      resOrWs.close(1008, 'No token provided'); // Close WebSocket connection with a policy violation code
    }
    return null;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
  } catch (err) {
    if (resOrWs instanceof require('http').ServerResponse) {
      utils.writeJson(resOrWs, { message: 'Failed to authenticate token' }, 403);
    } else {
      resOrWs.close(1008, 'Failed to authenticate token'); // Close WebSocket connection with a policy violation code
    }
    return null;
  }
}