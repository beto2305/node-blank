// set up ========================
const conf = require('config');

const app = require('./config/express');
const server = require('http').Server(app);
const logger = require('./application/libs/logger').logger;




logger.info("all modules loaded");
//require('./config/database')();


server.listen( app.get('port'), () => {
    logger.info("Running on "+ conf.get('server.environment') + " environment. NODE_ENV is " + process.env.NODE_ENV);
    logger.info('Server initialized on ' + conf.get('server.port') + " port");
});