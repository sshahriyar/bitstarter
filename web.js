var express = require('express');

var app = express();

//app.use(express.static(__dirname ));

//console.log(__dirname);
// The number of milliseconds in one day
var oneDay = 86400000;

// Use compress middleware to gzip content
app.use(express.compress());

// Serve up content from public directory
app.use(express.static(__dirname, { maxAge: oneDay }));

//var app = express.createServer(express.logger());
//
//app.get('/', function(request, response) {
//    var fs = require ('fs');                        
//    var data = fs.readFileSync('index.html');  
//    var buf = new Buffer (data);
//    response.send(buf.toString('utf-8'));
//    
//});

//app.get('/index.html', function(request, response) {
//    var fs = require ('fs');                        
//    var data = fs.readFileSync('index.html');  
//    var buf = new Buffer (data);  
//    response.send(buf.toString('utf-8'));
//
//});

//app.get('/login.html', function(request, response) {
//    var fs = require ('fs');                        
//    var data = fs.readFileSync('login.html');  
//    var buf = new Buffer (data);  
//    response.send(buf.toString('utf-8'));
//
//});

//app.get('/register.html', function(request, response) {
//    var fs = require ('fs');                        
//    var data = fs.readFileSync('register.html');  
//    var buf = new Buffer (data);  
//    response.send(buf.toString('utf-8'));
//
//});












var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
