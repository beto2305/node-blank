'use strict';

// set up ========================
let
    config = require('config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    methodOverride = require('method-override'),
    app = express(),
    cors = require('cors'),
    logFactory = require('./libs/logger'),
    routes = require('./routes/hello'),
    prometheusFactory = require('./libs/prometheus'),
    Sentry = require('@sentry/node'),
    logger;

exports.bootstrap = function () {
    // ***** Starting container log system *****
    logger = logFactory.init(config);
    logger.info('Middleware is on - ' + config.api.name + ' - ' + config.api.version);

    logger.info("Running on " + config.server.environment + " environment. NODE_ENV is " + process.env.NODE_ENV);

    // ***** Initialize Express ******
    // sentry support
    if (null != config.sentry && config.sentry.enabled && null !== process.env.SENTRY_DSN) {
        // The request handler must be the first middleware on the app
        app.use(Sentry.Handlers.requestHandler());

        // The error handler must be before any other error middleware and after all controllers
        app.use(Sentry.Handlers.errorHandler());

        logger.info("Sentry support is enabled!")
    }

    // Starting CORS
    app.use(cors());

    // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
    app.use(methodOverride());

    // Parse incoming request bodies in a middleware before your handlers, available under the req.body property
    app.use(bodyParser.json());

    // Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option.
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // protect app from some well-known web vulnerabilities by setting HTTP headers appropriately
    app.use(helmet())
    app.disable('x-powered-by') //The Hide Powered-By middleware removes the X-Powered-By header to make it slightly harder for attackers to see what potentially-vulnerable technology powers your site
    app.use(helmet.ieNoOpen()) // Sets "X-Download-Options: noopen".

    // app config
    app.set('config', config);

    // prometheus
    if (null != config.prometheus && config.prometheus.enabled) {
        let prometheus = prometheusFactory.init(app, logger)

        /**
         * The below arguments start the counter functions
         */
        app.use(prometheus.requestCounters);
        app.use(prometheus.responseCounters);

        /**
         * Enable metrics endpoint
         */
        prometheus.injectMetricsRoute(app);

        /**
         * Enable collection of default metrics
         */
        prometheus.startCollection();
    }

    // initializing routes
    routes.init(app, logger);
}

exports.run = function () {

    app.listen(process.env.PORT || config.server.port, () => {
        logger.info('Server initialized on ' + config.get('server.port') + " port");
    }).on('error', (err) => {
        logger.error('Err: Error listen server: ' + err);
    });
};

// just to enable tests with mocha and chai
exports.app = function () {
    return app;
}