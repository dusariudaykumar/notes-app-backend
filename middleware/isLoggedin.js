const User = require("../models/user");
const jwt = require("jsonwebtoken");

const isLoggedin = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization error. Invalid token.",
    });
    return;
  }
  try {
    // const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authorization error. User not found.",
    });
  }
};

module.exports = isLoggedin;
