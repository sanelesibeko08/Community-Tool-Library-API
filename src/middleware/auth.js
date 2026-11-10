const jwt = require('jsonwebtoken');
const config = require('../config');
const { unauthorizedError } = require('../utils/errorResponse');

function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  const match = authorization && authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    const error = unauthorizedError('Authentication required');
    return res.status(401).json(error.body);
  }

  try {
    const payload = jwt.verify(match[1], config.jwtSecret);
    req.user = payload;
    return next();
  } catch (error) {
    const response = unauthorizedError('Authentication required');
    return res.status(401).json(response.body);
  }
}

module.exports = authenticate;
