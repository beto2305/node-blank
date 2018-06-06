module.exports = function(app) {

    // api to handle requests
    var api = app.api.hello;
     
    // GET method
    app.get('/v1/hello', api.handleHelloGetMany);
    app.get('/v1/hello/:cpf', api.handleHelloGetOne);

    // POST method
    app.post('/v1/hello', api.handleHelloPost);

    // DELETE Method
    app.delete('/v1/hello/:cpf', api.handleHelloDelete);

    // PUT Method
    app.put('/v1/hello/:cpf', api.handleHelloPut);

    return this;
  
  };
