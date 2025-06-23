const viewMiddleware = (req, res, next) => {
  res.locals.currentPage = req.url;
  next();
};

module.exports = { viewMiddleware };
