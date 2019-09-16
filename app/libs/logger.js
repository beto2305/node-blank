'use strict';

let
    winston = require('winston'),
    Sentry = require('winston-transport-sentry-node'),
    os = require("os")

module.exports.init = function (config) {

    let logFactory = winston.createLogger({
        level: 'info',
        format: winston.format.simple(),

        // By default, winston will exit after logging an uncaughtException. 
        // If this is not the behavior you want, set exitOnError = false
        exitOnError: false,
        transports: [
            //
            // - Write all logs error (and below) to `error.log`.
            //
            new winston.transports.File({
                filename: `logs / ${os.hostname()} - errors.log`,
                level: 'error',
                maxSize: config.log.maxLogFileSize,
                maxFiles: config.log.maxLogFiles
            }),
        ],

        // Handling Uncaught Exceptions with winston
        // With winston, it is possible to catch and log uncaughtException events from your process. // With your own logger instance you can enable this behavior when it's 
        // created or later on in your applications lifecycle
        exceptionHandlers: [
            new winston.transports.File({
                filename: `logs/ ${os.hostname()} - exceptions.log`,
                maxSize: config.log.maxLogFileSize,
                maxFiles: config.log.maxLogFiles
            })
        ]
    });

    // sentry support
    if (null != config.sentry && config.sentry.enabled && null !== process.env.SENTRY_DSN) {
        logFactory.add(
            new Sentry({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.NODE_ENV,
                level: config.sentry.logLevel
            })
        );

    }


    // console only in development mode
    if (process.env.NODE_ENV === 'development') {
        logFactory.add(new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
    }

    return logFactory;

};

