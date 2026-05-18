const initData = require("./data.js");
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(Mongo_url);
}
const initDB = async () => {
  initData.data = initData.data.map((ob) => ({
    ...ob,
    owner: "6a02389e4271eaeaa6d30483",
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialized successfully");
};

initDB();
