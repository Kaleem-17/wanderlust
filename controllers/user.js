const User = require("../models/user.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.rederSignupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signupUser = async (req, res) => {
  try {
    let { fullname, username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already registered. Please login.");
      return res.redirect("/signup");
    }

    const user = new User({ fullname, username, email });
    await User.register(user, password);
    req.flash("success", "User Registered");
    res.redirect("/listing");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.rederLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  try {
    req.flash("success", `Wellcome back ${req.user.username}`);
    let redirectUrl = res.locals.originalUrl || "/listing";
    res.redirect(redirectUrl);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/login");
  }
};

module.exports.logoutUser = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out!");
    res.redirect("/listing");
  });
};
