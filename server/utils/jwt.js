// server/utils/jwt.js
const jwt = require('jsonwebtoken');

function ensurePlainObject(p) {
  return Object.prototype.toString.call(p) === '[object Object]';
}

const signAccessToken = (payload) => {
  // ensure payload is a plain object
  if (!payload || !ensurePlainObject(payload)) {
    throw new Error('signAccessToken expects payload to be a plain object');
  }
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  });
};

const signRefreshToken = (payload, jti) => {
  if (!payload || !ensurePlainObject(payload)) {
    throw new Error('signRefreshToken expects payload to be a plain object');
  }
  // include jti claim
  return jwt.sign({ ...payload, jti }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  });
};

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
