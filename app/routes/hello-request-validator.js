'use strict';

let
    validator = require('express-joi-validation')({
        passError: true
    }),
    BaseJoi = require('joi'),
    Extension = require('joi-date-extensions'),
    Joi = BaseJoi.extend(Extension);

exports.validateHelloGetOne = function () {

    let
        payload = Joi.object({
            'cpf'  : Joi.string().regex(/[0-9]+/).min(11).max(11).required()
        
        });

    return validator.params(payload);
};

exports.validateHelloPost = function () {

    let
        payload = Joi.object({
            'cpf'  : Joi.string().regex(/[0-9]+/).min(11).max(11).required()
        });

    return validator.body(payload);
};

