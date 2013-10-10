/*jshint devel:true, node:true, strict:false */
/*global require */

var express = require('express'),
    path = require('path'),
	app = express();

app.configure(function() {
	app.use(express.logger('dev')); //default, short, tiny, dev
	app.use(express.bodyParser());
    app.use(express['static'](path.join(__dirname, 'public')));
});

//for the sake of simplicity, let's have an exported global scope named "data",
//that will be used as an in-memory scope for the running application
var scope = {};
require('./routes/anagram').init(app,scope);

app.listen( 3000 );
console.log('Server running at http://127.0.0.1:3000/');
