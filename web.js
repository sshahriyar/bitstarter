var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    var fs = require ('fs');                        
    var data = fs.readFileSync('index.html');  
    var buf = new Buffer (data);                                                   //console.log(buf.toString('utf-8'));
    response.send(buf.toString('utf-8'));

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
