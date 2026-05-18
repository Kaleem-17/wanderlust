const Joi = require("joi");

const listingSchema = Joi.object({
  Listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      filename: Joi.string().allow("", null),
      url: Joi.string().uri().allow("", null),
    }),
    price: Joi.number().min(0).required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
});

// const reviewSchema = Joi.object({
//   review: Joi.object({
//     rating: Joi.number().required().min(1).max(5),
//     comment: Joi.string().strict(true).required(),
//   }).required(),
// });
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (/^\d+$/.test(value)) {
          return helpers.error("comment.pureNumber", {
            message: "Comment cannot be only numbers",
          });
        }
        return value;
      }),
  }).required(),
});

module.exports = { listingSchema, reviewSchema };
