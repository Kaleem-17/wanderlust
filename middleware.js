const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./Schema.js");
const ExpressError = require("./utills/ExpressError.js");

module.exports.isLogedIn = (req, res, next) => {
  req.session.originalUrl = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "You are not Logged In, Log In First!");
    return res.redirect("/login");
  }
  next();
};

// module.exports.saveOriginalUrl = (req, res, next) => {
//   res.locals.originalUrl = req.session.originalUrl;
//   console.log(res.locals.originalUrl);
//   next();
// };

module.exports.saveOriginalUrl = (req, res, next) => {
  if (req.session.originalUrl && req.session.originalUrl.includes("review")) {
    res.locals.originalUrl = req.session.originalUrl.split("/review")[0];
  } else {
    res.locals.originalUrl = req.session.originalUrl;
  }
  // console.log(res.locals.originalUrl);
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(req.user);
  // console.log(listing.owner);
  if (!req.user._id.equals(listing.owner._id)) {
    req.flash("error", "You are not the owner!");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!req.user._id.equals(review.author._id)) {
    req.flash("error", "You are not the author!");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

// Schema validation function with Joi Schema
module.exports.validatelistingSchema = (req, res, next) => {
  // ✅ Joi schema has a validate() method
  let { error } = listingSchema.validate(req.body);

  if (error) {
    // Pass the error message to ExpressError
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// defining review schema validation
module.exports.validateReviewSchema = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
