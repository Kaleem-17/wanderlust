// init/geocode.js

require("dotenv").config({ path: "../.env" }); // go up one level to find .env
const mongoose = require("mongoose");
const maptilerClient = require("@maptiler/client");
const Listing = require("../models/listing.js");

maptilerClient.config.apiKey = process.env.MAPTILER_KEY;

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

async function geocodeAllListings() {
  await mongoose.connect(Mongo_url);
  console.log("Connected to DB");

  // Find all listings that are missing geometry
  const listings = await Listing.find({ geometry: { $exists: false } });
  console.log(`Found ${listings.length} listings without coordinates`);

  for (let listing of listings) {
    try {
      const geoData = await maptilerClient.geocoding.forward(
        `${listing.location}, ${listing.country}`,
      );

      const coordinates = geoData.features[0].geometry.coordinates;

      await Listing.findByIdAndUpdate(listing._id, {
        geometry: {
          type: "Point",
          coordinates,
        },
      });

      console.log(`✅ ${listing.title} (${listing.location}) → ${coordinates}`);
    } catch (err) {
      console.log(`❌ Failed for ${listing.title}: ${err.message}`);
    }
  }

  console.log("Done!");
  mongoose.connection.close();
}

geocodeAllListings();
