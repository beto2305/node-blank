const mongoose = require('mongoose');
const conf = require('config');
const logger = require('../application/libs/logger').logger;
module.exports = function () {

    var uri = 'mongodb://' + conf.get('database.dbUser') + ':' +
        conf.get('database.dbPwd') + '@' +
        conf.get('database.host') + ':' +
        conf.get('database.port') + '/' +
        conf.get('database.dbName');

    //Resolve error mongoose mpromise (mongoose's default promise library) is deprecated
    mongoose.Promise = global.Promise;
    mongoose.connect(uri);

    logger.debug("database URI: " + uri)

    mongoose.connection.on('connected', function () {
        logger.debug('Conectado ao MongoDB')
    });

    mongoose.connection.on('error', function (error) {
        logger.debug('Erro na conexão: ' + error);
    });

    mongoose.connection.on('disconnected', function () {
        logger.debug('Desconectado do MongoDB')
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            logger.debug('Aplicação terminada, conexão fechada')
            process.exit(0);
        });
    });
};