const { ErrorController } = require('../controllers/error-controller');

const notFoundMiddleware = (req, res) => {
  ErrorController.handle404Error(res, req.originalUrl);
};

module.exports = { notFoundMiddleware }; 