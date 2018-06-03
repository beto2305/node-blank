const winston = require('winston');
const os = require("os");
const env = process.env.NODE_ENV || 'development';
const hostname = os.hostname();


module.exports.logger = new (winston.Logger)({

    transports: [
        new (winston.transports.Console)({
            json: false,
            timestamp: true,
            colorize: true,
            level: 'debug'
        }),
        new (require('winston-daily-rotate-file'))( {
            silent: false, /* true for disable log */
            level: env === 'development' ? 'debug' : 'info',
            filename: './logs/'+ hostname + '.debug.log',
            datePattern: 'YYYY-MM-DD',
            json: false,
            timestamp: true,
        })
    ],
    
    exceptionHandlers: [
        new (require('winston-daily-rotate-file'))( {
            filename: './logs/'+hostname+'.exceptions.log',
            datePattern: 'YYYY-MM-DD',
            json: false,
            timestamp: true
        })
    ],
    exitOnError: false
});