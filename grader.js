#!/usr/bin/env node
/*
URl Usage: node grader.js -c checks.json --url http://shielded-sands-9001.herokuapp.com/ 
Author (modification): syed.shariyar@gmail.com  
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require ('restler');
var util = require ('util');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var HTMLURL_DEFAULT = "dummyURL.com";
var DOWNLOADED_FILE = "downloaded_file.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var processURL = function (result){
    
    if (result instanceof Error){
	util.puts('Error: ' + result.message);
	process.exit(1);
    } else {
	
	//util.puts(result.toString());
	fs.writeFileSync(DOWNLOADED_FILE, result);
        var checkJson = checkHtmlFile(DOWNLOADED_FILE, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
}

var assertURLExists =  function(theURL){
    
    if ((theURL.indexOf("http") > -1) &&  (theURL.indexOf(".")> -1)){
	if (fs.existsSync(theURL)) {
	    fs.unlinkSync(DOWNLOADED_FILE);    
	}
	return theURL.toString();
    } else {
	console.error("Incorrect URL, remove \"www\" if any.");
	process.exit(1);
    }
//    return rest.get(theUrl).on('complete',downloadURL); 
}


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option ('-u, --url <url of page>', 'Link to your page', clone(assertURLExists), HTMLURL_DEFAULT)
        .parse(process.argv);
    
    
    if (program.url != HTMLURL_DEFAULT){
	//console.error(program);
	//fileName = program.url;
	rest.get(program.url).on('complete',processURL);
	
	//console.error("Processing Complete!");
    } else {
	
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }
    
   

} else {
    exports.checkHtmlFile = checkHtmlFile;
}
