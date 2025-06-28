const viewMiddleware = (req, res, next) => {
  res.locals.currentPage = req.url ?? null;
  res.locals.pageTitle = null;
  res.locals.formTitle = null;
  res.locals.formAction = null;
  res.locals.errors = null;
  res.locals.searchAction = null;
  res.locals.query = req.query;
  res.locals.form = {};
  res.locals.filterConfig = {};
  next();
};

module.exports = { viewMiddleware };
