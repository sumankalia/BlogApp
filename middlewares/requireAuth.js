const jwt = require("jsonwebtoken");
const { MY_SECRET_KEY } = require("../config/constants");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, MY_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token." });
    }

    req.decoded = payload;
    next();
  });
};
