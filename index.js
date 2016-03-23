/*jshint node:true*/
'use strict';

var express = require('express');
var PORT = process.env.PORT || 8080;

var app = express();
var router = express.Router();

// set up routes
require('./routes')( router );
app.use( '/', router );

// set up static directory
app.use( express.static('app/dist') );

// go baby go!
app.listen( PORT );
