"use strict";

let responseFactory = require('../libs/response-factory').init(),
    helloControllerFactory = require('../controllers/hello');

module.exports.init = function (app, logger) {
    logger.info("Initializing APIs.")

    let controller = helloControllerFactory.init(logger);

    let api = {
        //
        handleHelloGetOne: (req, res) => {
            logger.debug("api.hello.handleHelloGetOne - req method: " + req.method);
            try {
                let cpf = req.params.cpf;

                logger.debug("api.hello.handleHelloGetOne - CPF: " + cpf);

                if (cpf == "11111111111") {
                    return responseFactory.notFound(req, res, "CPF não encontrado", "O CPF informado não foi encontrado na base de dados.", logger);
                }

                return responseFactory.ok(req, res, cpf, logger);

            } catch (error) {
                return responseFactory.serverError(req, res, error, logger);
            }
        },

        //
        handleHelloPost: (req, res) => {
            logger.debug("api.hello.handleHelloPost - req method: " + req.method);
            try {
                let msg = "CPF: " + req.body.cpf;

                responseFactory.ok(req, res, msg, logger)
            } catch (error) {
                return responseFactory.serverError(req, res, error, logger);
            }
        },

        //
        handleHelloDelete: (req, res) => {
            logger.debug("api.hello.handleHelloDelete - req method: " + req.method);
            try {
                responseFactory.ok(req, res, "teste", logger)
            } catch (error) {
                return responseFactory.serverError(req, res, error, logger);
            }
        },

        //
        handleHelloPut: (req, res) => {
            logger.debug("api.hello.handleHelloPut - req method: " + req.method);
            try {
                responseFactory.ok(req, res, "teste", logger)
            } catch (error) {
                return responseFactory.serverError(req, res, error, logger);
            }
        },

    }
    return api;
}