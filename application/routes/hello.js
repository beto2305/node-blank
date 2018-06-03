module.exports = function(app) {

    // api to handle requests
    var api = app.api.hello;
     
    // GET method
    app.get('/v1/hello/:name', api.handleHelloGet);

    // POST method
    app.post('/v1/hello', api.handleHelloPost);

    app.route('/v1/hello')
        .put(api.handleHello)
        .delete(api.handleHello);
  

    return this;
  
  };
