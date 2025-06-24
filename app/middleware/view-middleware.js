const viewMiddleware = (req, res, next) => {
  res.locals.currentPage = req.url ?? null;
  res.locals.pageTitle = null;
  res.locals.formTitle = null;
  res.locals.formAction = null;
  res.locals.errors = null;
  next();
};

module.exports = { viewMiddleware };
