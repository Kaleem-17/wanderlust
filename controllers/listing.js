const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_KEY;
const Listing = require("../models/listing.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const ExpressError = require("../utills/ExpressError.js");

module.exports.index = async (req, res, next) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  const location = req.body.Listing.location;
  const country = req.body.Listing.country;
  const geoData = await maptilerClient.geocoding.forward(
    `${location}, ${country}`,
  );

  const url = req.file.secure_url;
  const filename = req.file.public_id;
  const newListing = new Listing(req.body.Listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = geoData.features[0].geometry;

  let savedListing = await newListing.save();

  req.flash("success", "New Listing Created");
  res.redirect("/listing");
};

module.exports.searchListing = async (req, res, next) => {
  let searchTerm = req.query.location;

  // Search for matches in either location OR country (case-insensitive)
  let allListing = await Listing.find({
    $or: [
      { location: { $regex: searchTerm, $options: "i" } },
      { country: { $regex: searchTerm, $options: "i" } },
    ],
  });

  if (!allListing || allListing.length === 0) {
    req.flash(
      "error",
      "No listing available for this location or country. Please check your search term again.",
    );
    return res.redirect("/listing");
  }

  res.render("listings/searched.ejs", { allListing, searchTerm });
};

module.exports.editListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "listing not found");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    const upDateListing = await Listing.findById(id);
    upDateListing.image = {
      url: req.file.secure_url,
      filename: req.file.public_id,
    };
    await upDateListing.save();
  }

  // 👇 Geocode the updated location
  const location = req.body.Listing.location;
  const country = req.body.Listing.country;
  const geoData = await maptilerClient.geocoding.forward(
    `${location}, ${country}`,
  );
  const coordinates = geoData.features[0].geometry.coordinates;

  // 👇 Add geometry to the update
  await Listing.findByIdAndUpdate(id, {
    ...req.body.Listing,
    geometry: {
      type: "Point",
      coordinates,
    },
  });

  req.flash("success", "Listing updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listing");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews", // ← also "reviews" not "review"
      populate: {
        path: "author", // ← nested populate goes INSIDE the options object
      },
    })
    .populate("owner");
  if (!listing) {
    throw new ExpressError(404, "listing not found");
  }
  // console.log("MAPTILER_KEY:", process.env.MAPTILER_KEY);
  res.render("listings/show.ejs", {
    listing,
    mapTilerKey: process.env.MAPTILER_KEY,
  });
};
