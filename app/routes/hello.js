'use strict';

let apiFactory = require('../api/hello'),
    responseFactory = require('../libs/response-factory').init(),
    requestValidator = require('./hello-request-validator');

module.exports.init = function (app, logger) {
  logger.info("Initializing routes.")

  let api = apiFactory.init(logger);

  // ***** Route test server on! *****
  app.all(['/', '/api', '/api/v1'], function (req, res) {
    res.json({
      core: 'Middleware is on - ' + app.get('config').api.name + '!',
      version: app.get('config').api.version,
      date: new Date()
    });
  });

  // GET method
  app.get('/api/v1/hello', api.handleHelloGetOne);

  app.get('/api/v1/hello/:cpf', requestValidator.validateHelloGetOne(), api.handleHelloGetOne);

  // POST method 
  app.post('/api/v1/hello', requestValidator.validateHelloPost(), api.handleHelloPost);

  // DELETE Method
  app.delete('/api/v1/hello/:cpf', api.handleHelloDelete);

  // PUT Method
  app.put('/api/v1/hello/:cpf', api.handleHelloPut);


  /* Erro Handler express-joi-validation */
  app.use((err, req, res, next) => {
    if (err.error && typeof err.error.isJoi !== 'undefined') {
      responseFactory.badRequest(req, res, err.error.toString(), logger);
    } else {
      // pass on to another error handler
      next(err);
    }
  });

  // catch requests for not mapped URLs
  app.use(function(req, res){
    let msg = 'The requested resource (' + req.originalUrl + ') with ' + req.method + ' method was not found';
    responseFactory.notFound(req, res, 'URL not found', msg, logger);
  });

  return this;

};
