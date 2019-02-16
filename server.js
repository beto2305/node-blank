'use strict';

// Getting Env
require('dotenv').config();

// Getting Launcher
const launcher = require('./app/launcher');

// Set Configuration
launcher.bootstrap();

// Starting application
launcher.run();