const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utills/wrapAsync");
const passport = require("passport");
const { saveOriginalUrl } = require("../middleware");
const userController = require("../controllers/user.js");
const { reviewSchema } = require("../Schema.js");

router
  .route("/signup")
  .get(userController.rederSignupForm)
  .post(userController.signupUser);

router
  .route("/login")
  .get(userController.rederLoginForm)
  .post(
    saveOriginalUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser,
  );

router.get("/logout", userController.logoutUser);
module.exports = router;
