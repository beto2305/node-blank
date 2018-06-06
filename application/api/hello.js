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

            // check if CPF already exists
            HelloModel.findOne({ cpf: req.body.cpf }, (err, data) => {
                if (err) {
                    logger.error(err)
                    res.status(400).json(err);
                    return;
                } else if (data && data.length) {
                    res.status(404).json("cpf " + req.params.cpf + " already exists");
                    return;                 
                }

            });     

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

    api.handleHelloDelete = (req, res) => {
        logger.debug("api.hello.handleHelloDelete - req method: " + req.method);

        try {
            // schema to DELETE method
            var helloDeleteSchema = {
                // mandatory parameter
                cpf: Joi.string().length(11).required()
            };

            const validateResult = Joi.validate(req.params, helloDeleteSchema);

            if (validateResult.error) {
                res.status(400).json(validateResult.error.details[0].message);
                return;
            }

            HelloModel.remove({ cpf: req.params.cpf }, (err, data) => {
                if (err) {
                    logger.error(err)
                    res.status(400).json(err);
                } else if (data && data.result.n == 0) {
                    res.status(404).json("cpf " + req.params.cpf + " not found");
                } else if (data && data.result.n > 0) {
                    res.send("cpf " + req.params.cpf + " sucessfuly removed!")
                }
                
                return;
            });            
        } catch (error) {
            res.status(400).json('Invalid request: ' + error);
            return;
        }

    }

    api.handleHelloPut = (req, res) => {
        logger.debug("api.hello.handleHelloPut - req method: " + req.method);

        try {

            const validateCpf = Joi.validate(req.params, {cpf: Joi.string().length(11).required()});
            if (validateCpf.error) {
                res.status(400).json(validateCpf.error.details[0].message);
                return;
            }

            const validateName = Joi.validate(req.body, {name: Joi.string().required()});
            if (validateName.error) {
                res.status(400).json(validateName.error.details[0].message);
                return;
            }

            HelloModel.update({ cpf: req.params.cpf }, {name: req.body.name}, (err, data) => {
                if (err) {
                    logger.error(err)
                    res.status(400).json(err);

                } else if (data && data.n == 0) {
                    res.status(404).json("cpf " + req.params.cpf + " not found");
                } else if (data && data.n > 0) {
                    res.send("cpf " + req.params.cpf + " sucessfuly updated - name:" + req.body.name)
                }
                return;
            });            
        } catch (error) {
            res.status(400).json('Invalid request: ' + error);
            return;
        }

    }

    return api;
}