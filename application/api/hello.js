const logger = require('../libs/logger').logger;


module.exports = function (app) {

    var api = {}

    var controller = app.controllers.hello;


    api.handleHelloGet = (req, res) => {
        logger.debug("api.hello.handleHelloGet - req method: " + req.method);
        res.setHeader('Access-Control-Allow-Origin', '*');

        var msg = controller.handleHello("api.handleHello");

        res.send("Hello, " + req.query.name + " - req method: " + req.method + 
            " - message: " + msg);
    }

    api.handleHello = (req, res) => {
        logger.debug("api.hello.handleHello - req method: " + req.method);
        res.setHeader('Access-Control-Allow-Origin', '*');

        var msg = controller.handleHello("api.handleHello");

        res.send("Hello, " + req.query.name + " - req method: " + req.method + 
            " - message: " + msg);
    }

    return api;
}