
//app.use(express.static(__dirname ));

//console.log(__dirname);

// Use compress middleware to gzip content
//app.use(express.compress());



var express = require('express');
var http = require('http');
var app = express();
var async   = require('async');
var db      = require('./models');
// The number of milliseconds in one day
var oneDay = 86400000;
   
app.configure(function(){
        //app.set('port', 8080);
	app.set('port', process.env.PORT || 8081);
	app.set('views', __dirname + '/views');
        
	app.set('view engine', 'ejs');
//	app.set('view engine', 'ejs');
	app.locals.pretty = true;
//	app.use(express.favicon());
//	app.use(express.favicon(path.join(__dirname, 'public/img/favicon.ico')));
//	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
	//app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
        //app.use(express.static(__dirname+'/public', { maxAge: oneDay }));
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

require('./router')(app);

//http.createServer(app).listen(app.get('port'), function(){
//	console.log("Express server listening on port " + app.get('port'));
//})

//global.db.sequelize.sync({force: true}).complete(function(err) {
global.db.sequelize.sync().complete(function(err) {
    if (err) {
	throw err;
    } else {
	var DB_REFRESH_INTERVAL_SECONDS = 600;
	async.series([
	    function(cb) {
		// Mirror the orders before booting up the server
		console.log("Initial mirror of Coinbase orders at " + new Date());
                cb(null);
		//global.db.Order.refreshFromCoinbase(cb);
	   },
	    function(cb) {
		// Begin listening for HTTP requests to Express app
		http.createServer(app).listen(app.get('port'), function() {
		    console.log("Express Server Listening on " + app.get('port'));
		})

		// Start a simple daemon to refresh Coinbase orders periodically
		setInterval(function() {
                    
		    console.log("Refresh db at " + new Date());
		   // global.db.Order.refreshFromCoinbase(cb);
		}, DB_REFRESH_INTERVAL_SECONDS*1000);
		cb(null);
	    }
	]);
    }
});













var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
