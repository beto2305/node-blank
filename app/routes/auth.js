const jwt = require("jsonwebtoken");
const responseFactory = require('../libs/response-factory').init();


module.exports.init = function (logger) {

  logger.info("Initializing Auth Layer.")

  let handle = {
    authenticateUser: (req, res, next) => {

      const token = req.header("x-auth-token");
      if (!token) {
        return responseFactory.unauthorized(req, res, "Access denied. No user token provided.", logger)
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        return next();
      } catch (ex) {
        return responseFactory.unauthorized(req, res, "Access denied. Invalid user token.", logger)
      }
    },

    authenticateApiConsumer: (req, res, next) => {
      const token = req.header("x-auth-token-api");
      if (!token) {
        return responseFactory.unauthorized(req, res, "Access denied. No API token provided.", logger)
      } else if (token !== process.env.API_TOKEN) {
        return responseFactory.unauthorized(req, res, "Access denied. Invalid API token.", logger)
      }

      next();
    }
  }

  return handle;
}
