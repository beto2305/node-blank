const logger = require('../libs/logger').logger;

module.exports = function (app) {

    var controller = {}

    controller.handleHello = (name) => {
        logger.debug("controller.hello - name: " + name);

        return "Dear, " + name;

    }

    return controller;
}