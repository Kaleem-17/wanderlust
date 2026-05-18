// wrap function to use instead of try and catch

module.exports = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};
