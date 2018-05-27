const logger = require('../libs/logger').logger;

module.exports = function (app) {

    var controller = {}

    controller.handleHello = (parameter) => {
        logger.debug("controller.hello - parameter: " + parameter);

        var msg = "This is a message from controller. I've received parameter: " + parameter;

        return msg;

    }

    return controller;
}