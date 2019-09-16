'use strict';

let 
    winston = require('winston'),
    os = require("os"),
    hostname = os.hostname(),
    env = process.env.NODE_ENV || 'development',
    Sentry = require('@sentry/node')


module.exports.init = function (config) {
    if (null != config.sentry && config.sentry == 'enabled' && null !== process.env.SENTRY_DSN) {
        Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
    }

    let transports = [
        new (require('winston-daily-rotate-file'))({
            silent: false, /* true for disable log */
            level: env === 'development' ? 'debug' : 'info',
            filename: './logs/' + hostname + '.log',
            datePattern: 'YYYY-MM-DD',
            json: false,
            timestamp: true,
            maxSize: config.maxLogFileSize + 'k', 
            maxFiles: config.maxLogFiles
        })
    ]

    // enable console only on development mode
    if (env == 'development') {
        transports.push(
            new (winston.transports.Console)({
                json: false,
                timestamp: true,
                colorize: true,
                level: 'debug'
            }),
        )
    }

    let logFactory = new (winston.Logger)({
        transports,
        exceptionHandlers: [
            new (require('winston-daily-rotate-file'))({
                filename: './logs/' + hostname + '.exceptions.log',
                datePattern: 'YYYY-MM-DD',
                json: false,
                timestamp: true,
                maxSize: config.log.maxLogFileSize, 
                maxFiles: config.log.maxLogFiles
            })
        ],
        exitOnError: false
    })

    logFactory.logError = (error) => {
        logFactory.error(error)
        if (null != config.sentry && config.sentry == 'enabled' && null !== process.env.SENTRY_DSN) {
            Sentry.captureException(error)
        }
    }

    return logFactory;

};

