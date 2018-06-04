const logger = require('../libs/logger').logger;
const Joi = require('joi');
const HelloModel = mongoose.model('Hello');

module.exports = function (app) {

    var api = {}

    var controller = app.controllers.hello;

    api.handleHelloGetMany = (req, res) => {
        logger.debug("api.hello.handleHelloGetMany - req method: " + req.method);
        try {
            res.send("Too many results - req method: " + req.method);
            return;
        } catch (error) {
            res.status(400).send('Invalid request: ' + error);
            return;
        }
    }

    api.handleHelloGetOne = (req, res) => {
        logger.debug("api.hello.handleHelloGetOne - req method: " + req.method);

        try {
            // schema to GET method
            var helloGetSchema = {
                // mandatory parameter
                cpf: Joi.string().length(11).required()
            };

            const validateResult = Joi.validate(req.params, helloGetSchema);

            if (validateResult.error) {
                res.status(400).send(validateResult.error.details[0].message);
                return;
            }

            var newName = controller.handleHello(req.query.cpf);

            res.send("Hello Dear, with CPF" + newName + " - req method: " + req.method);            
        } catch (error) {
            res.status(400).send('Invalid request: ' + error);
            return;
        }

    }

    api.handleHelloPost = (req, res) => {
        logger.debug("api.hello.handleHelloPost - req method: " + req.method);

        try {
            // schema to POST method
            var helloPostSchema = Joi.object().keys({
                // mandatory parameter
                cpf: Joi.string().length(11).required(),
                name: Joi.string().required()
              
            });

            const validateResult = Joi.validate(req.body, helloPostSchema);

            if (validateResult.error) {
                res.status(400).send(validateResult.error.details[0].message);
                return;
            }

            // save request on database


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