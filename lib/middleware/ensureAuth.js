const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies.session;
  const user = User.verifyToken(token);
  req.user = user;
  next();
};
