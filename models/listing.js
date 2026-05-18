const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Imported for review deletion
const User = require("./user.js"); // Imported for review deletion
const { string } = require("joi");

// Liting Mongoose Schema for all of our listing

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: String,
    url: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    // Add this field
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Mongoose post middleware to delete related reviews

listingSchema.post("findOneAndDelete", async (data) => {
  // console.log(`Deleted Listing is: ${data}`);
  if (data) {
    const res = await Review.deleteMany({ _id: { $in: data.reviews } });
    // console.log(res);
  }
});

// creating Listing Model

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
