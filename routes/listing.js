const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const ExpressError = require("../utills/ExpressError.js");
const wrapAsync = require("../utills/wrapAsync.js");
const {
  isLogedIn,
  isOwner,
  validatelistingSchema,
} = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const parser = multer({ storage });
// console.log("isLogedIn:", isLogedIn);
// console.log("isOwner:", isOwner);
// console.log("validatelistingSchema:", validatelistingSchema);
// console.log("listingController:", listingController);

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLogedIn,
    parser.single("Listing[image]"),
    validatelistingSchema,
    wrapAsync(listingController.createNewListing),
  );

router.get("/new", isLogedIn, listingController.newListing);
router.get("/search", listingController.searchListing);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLogedIn,
    isOwner,
    parser.single("Listing[image]"),
    validatelistingSchema,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLogedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingController.editListing),
);

module.exports = router;
