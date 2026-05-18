const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const ExpressError = require("../utills/ExpressError.js");
const {
  isLogedIn,
  isAuthor,
  validateReviewSchema,
} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// post rout for reviews

router.post("/", isLogedIn, validateReviewSchema, reviewController.postReview);

// rout for deleting reviews and thier ids from respective listing

router.delete(
  "/:reviewId",
  isLogedIn,
  isAuthor,
  reviewController.destroyReview,
);

module.exports = router;
