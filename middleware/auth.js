const jwt = require('jsonwebtoken');
const RevokedToken = require('../models/RevokedToken');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Check if the token is revoked
    const revokedToken = await RevokedToken.findOne({ token });
    if (revokedToken) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;