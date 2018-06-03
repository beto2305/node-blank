const logger = require('../libs/logger').logger;
const Joi = require('joi');

module.exports = function (app) {

    var api = {}

    var controller = app.controllers.hello;


    api.handleHelloGet = (req, res) => {
        logger.debug("api.hello.handleHelloGet - req method: " + req.method);
        res.setHeader('Access-Control-Allow-Origin', '*');

        try {
            // schema to GET method
            var helloGetSchema = {
                // mandatory parameter
                name: Joi.string().required()
            };

            const validateResult = Joi.validate(req.query, helloGetSchema);

            if (validateResult.error) {
                res.status(400).send(validateResult.error.details[0].message);
                return;
            }

            var newName = controller.handleHello(req.query.name);

            res.send("Hello, " + newName + " - req method: " + req.method);            
        } catch (error) {
            res.status(400).send('Invalid request: ' + error);
            return;
        }

    }

    api.handleHelloPost = (req, res) => {
        logger.debug("api.hello.handleHelloPost - req method: " + req.method);

        try {
            // schema to GET method
            var helloGetSchema = {
                // mandatory parameter
                name: Joi.string().required()
            };

            const validateResult = Joi.validate(req.body, helloGetSchema);

            if (validateResult.error) {
                res.status(400).send(validateResult.error.details[0].message);
                return;
            }

            res.send(req.body);
        } catch (error) {
            res.status(400).send('Invalid request: ' + error);
            return;
        }
    }

    api.handleHello = (req, res) => {
        logger.debug("api.hello.handleHello - req method: " + req.method);
        res.setHeader('Access-Control-Allow-Origin', '*');

        var msg = controller.handleHello("api.handleHello");

        res.send("req method: " + req.method);
    }

    return api;
}