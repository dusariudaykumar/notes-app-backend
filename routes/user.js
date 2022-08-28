const express = require("express");

const router = express.Router();
const {
  signupUser,
  signinUser,
  signoutUser,
} = require("../controllers/userController");

router.route("/signup").post(signupUser);
router.route("/signin").post(signinUser);
router.route("/signout").get(signoutUser);

module.exports = router;
