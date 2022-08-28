const User = require("../models/user");
const jwt = require("jsonwebtoken");

const isLoggedin = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    // const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "please login",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById({ _id: decoded.userId });

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

module.exports = isLoggedin;
