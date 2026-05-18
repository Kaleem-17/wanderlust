require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const initData = require("./init/data.js");
const methodOverride = require("method-override");
const ExpressError = require("./utills/ExpressError.js");
const ejsMate = require("ejs-mate");
const listing = require("./routes/listing.js");
const Listing = require("./models/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// setting up server
app.listen(8080, () => {
  console.log("app is listening at port 8080");
});

// connecting to DB

const DB_URL = process.env.ATLAS_URL;

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}

const store = MongoStore.create({
  mongoUrl: DB_URL,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 3600,
});

// Add error handling
store.on("error", function (err) {
  console.log("SESSION STORE ERROR:", err);
});

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// setting up engine and paths

app.engine("ejs", ejsMate); // This should be BEFORE setting views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// setting up middlewares

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Configure passport with User model
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// setting up router path here so that upp uses the router for all requests

app.use("/listing", listing);
app.use("/listing/:id/review", review);
app.use("/", user);

// rote path

// for incorrect paths

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ========== ERROR HANDLING MIDDLEWARE - MUST BE LAST ==========
app.use((err, req, res, next) => {
  let { status = 500, message = "Some error occurred" } = err;

  // Check if headers are already sent
  if (res.headersSent) {
    return next(err);
  }

  // Send appropriate response
  res.status(status).render("listings/error.ejs", { message });
});
