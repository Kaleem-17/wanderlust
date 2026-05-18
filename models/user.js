const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { default: passportLocalMongoose } = require("passport-local-mongoose");

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
