const validator = require('express-joi-validator');
const Joi = require('joi');

module.exports = function(app) {

    // api to handle requests
    var api = app.api.hello;
    
    // schema to GET method
    var helloGetSchema = {
        query: {
            // mandatory parameter
            name: Joi.string().required()
        }
    };
    
    // GET method
    app.get('/v1/hello', validator(helloGetSchema), api.handleHelloGet);

    app.route('/v1/hello')
        .put(api.handleHello)
        .post(api.handleHello)
        .delete(api.handleHello);
  

    return this;
  
  };
