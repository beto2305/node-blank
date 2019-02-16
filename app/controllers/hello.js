'use strict';

module.exports.init = function (logger) {

    logger.info("Initializing controller.")

    let controller = {
        //
        handleHello : (name) => {
            logger.debug("controller.hello - name: " + name);

            return "Dear, " + name;

        }
    }

    return controller;
}