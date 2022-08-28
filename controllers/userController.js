const User = require("../models/user");
const bcrypt = require("bcryptjs");
const getJwtToken = require("../helpers/getJwtToken");
//signup
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(500).json({
        success: false,
        message: "please provide all fields",
      });
    }
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(422).json({
        success: false,
        message: "Email Already Exists.",
      });
    } else {
      const protectedPwd = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: protectedPwd,
      });
      // cookieToken(user, res);

      const token = getJwtToken(user._id);
      res.status(201).json({
        success: true,
        message: "Signup successfull",
        user: {
          token,
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "SignUp failed. Please try again later",
    });
  }
};

//signin
const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(500).json({
        success: false,
        message: "please provide email and password",
      });
    }
    // find user based on email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(500).json({
        success: false,
        message: "The email you entered is not Registered.",
      });
    }
    const isValidPwd = await bcrypt.compare(password, user.password);

    if (!isValidPwd) {
      res.status(401).json({
        success: false,
        message: "The credentials you entered are invalid.",
      });
    }

    const token = getJwtToken(user._id);
    res.status(201).json({
      success: true,
      message: "Login successfull",
      user: {
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later",
    });
  }
};

//signout

const signoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, msg: "Logout Succes" });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
module.exports = {
  signupUser,
  signinUser,
  signoutUser,
};
