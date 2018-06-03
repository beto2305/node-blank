const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const conf = require('config');
const path = require('path');
const consign = require('consign');
const app = express();
const logger = require('../application/libs/logger').logger;

// setting context path
// app.set('context-app',conf.get('context-app'))

// app.use('/node-blank')

// logger.debug('Application responding at ' + app.get('context-app') + ' context.' );

app.set('secret', 'rcauth');
app.use(session({ 
    secret: 'sessionauth' 
}));

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

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

// expose static content
app.use( express.static(path.join(__dirname, '../public')));
/*
app.use('/app', express.static(path.join(__dirname, '../public/app')));
app.use('/partials', express.static(path.join(__dirname, '../public/app/partials')));
*/

logger.info("Running on "+ conf.get('server.environment') + " environment. NODE_ENV is " + process.env.NODE_ENV);

app.set('port', conf.get('server.port'));



consign({ cwd: 'application'})
    .include('models')
    .then('controllers')
    .then('api')
    //.then('routes/auth.js') //Torna obrigatório as chamadas passarem pela rota auth antes de chamar outras rotas.
    .then('routes')
    .into(app);


app.get('*', function(req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '../public') }); // load our public/index.html file
  //res.status(404).end();
});

// error handling middleware should be loaded after the loading the routes
if ('development' == conf.get('server.environment')) {
    app.use(function (err, req, res, next) {
        if (err) {
            return res.status(400).json(err);
        }
    });
}


logger.info("Express loaded!");

// app.options("/data/*", (req, res, next) => { // Passa pelo CORS
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//     res.send(200);
// });



module.exports = app;