const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const ExpressError = require("../utills/ExpressError.js");

module.exports.postReview = async (req, res, next) => {
  let { id } = req.params;
  let { review } = req.body;

  const newReview = new Review(review);
  newReview.author = req.user._id;
  await newReview.save();

  // Push to listing
  const listing = await Listing.findById(id);
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "Review Submitted");

  res.redirect(`/listing/${id}`);
};

module.exports.destroyReview = async (req, res, next) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");

  res.redirect(`/listing/${id}`);
};
