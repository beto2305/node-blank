const logger = require('../libs/logger').logger;
const Joi = require('joi');
const mongoose = require('mongoose');

const HelloModel = mongoose.model('Hello');

module.exports = function (app) {

    var api = {}

    var controller = app.controllers.hello;

    api.handleHelloGetMany = (req, res) => {
        logger.debug("api.hello.handleHelloGetMany - req method: " + req.method);
        try {
            HelloModel.find( (err, data) => {
                if (err) {
                    logger.error(err)
                    res.status(400).json(err);
                    return;
                }
                logger.debug("api.hello.handleHelloGetMany - found: " + data.length + " records.");
                res.json(data)
                return;
            });

        } catch (error) {
            res.status(400).json('Invalid request: ' + error);
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
                res.status(400).json(validateResult.error.details[0].message);
                return;
            }

            HelloModel.findOne({ cpf: req.params.cpf }, (err, data) => {
                if (err) {
                    logger.error(err)
                    res.status(400).json(err);
                    return;
                } else if (! data) {
                    res.status(404).json("cpf " + req.params.cpf + " not found");
                    return;                 
                }
                res.send(data)
                return;
            });            
        } catch (error) {
            res.status(400).json('Invalid request: ' + error);
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
            var helloModel = new HelloModel({ 
                cpf: req.body.cpf,
                name: req.body.name
            });

            helloModel.save( (err) => {
                if (err) {
                    res.status(400).json(err);
                    return;
                }

            });
    

            res.json(req.body);
        } catch (error) {
            res.status(400).json('Invalid request: ' + error);
            return;
        }
    }

    api.handleHello = (req, res) => {
        logger.debug("api.hello.handleHello - req method: " + req.method);
        res.setHeader('Access-Control-Allow-Origin', '*');

        var msg = controller.handleHello("api.handleHello");

        res.json("req method: " + req.method);
    }

    return api;
}