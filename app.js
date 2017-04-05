var fs = require('fs');
var parse = require('csv-parse');
var request = require('request');
var sleep = require('system-sleep');

var urls = new Array();
var csvFile = './csv/03April2017-one-csv-file-to-rule-them-all.csv';
var failureLog = './logs/failureLog.txt';
var requestErrorLog = './logs/requestErrorLog.txt';
var successLog = './logs/successLog.txt';
var sleepDelayMS = 1500;

/* Diable SSL Checking GLobally */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

/* Options for HTTP Get Request, remove Auth if you are not testing stage */
var requestOptions = {
    auth: {
        username: '',
        password: ''
    },
    followAllRedirects: 'true'
};


/* Receives a file and parses based on supplied delimeter, 
 * for each line passes 2 urls (original & final) to be tested. */ 
var parser = parse({delimiter: ','}, function(err, data){
    if (err) {
        console.error('Error: ', err);
        return;
    }
    
    data.forEach(function(row) {
        // URLS To Test, eh basing this on ruby version... csv file should be cleaner.
        var originalURL = row[3];
        var finalURL = row[6];
                
        //Tweak original url to use staging site
        var pattern = /support.mozilla.org/i;
        originalURL = originalURL.replace( pattern, "support-stage.allizom.org" );        
        
        // pass urls to request but sleep for N milliseconds to not kill the serve
        sleep(sleepDelayMS);
        //Show we are doing something
        process.stdout.write(".");
        testURL(originalURL, finalURL);
    });
});


 /* Requests original url and stores response following redirects */
function testURL(originalURL, finalURL) {
    requestOptions.url = originalURL;
    
    request(requestOptions, function (error, response, body) {
        if (error) {
            fs.appendFileSync(requestErrorLog, error + ' ' + originalURL + "\n");
        } else {
            writeResults(response, originalURL, finalURL);
        }     
    });    
}

/* if Final URL Matches URL (after all the redirects) record success if not record failure */
function writeResults(response, originalURL, finalURL) {
    if(response.request.uri.href === finalURL) {
        fs.appendFileSync(successLog, 'Success: ' + originalURL + " , " + finalURL + "\n");        
    } else {
        fs.appendFileSync(failureLog, 'Error: ' + originalURL + " , " + finalURL + " , " + response.request.uri.href + '\n'); 
    }
}

// Read CSV File, kicks off everything
fs.createReadStream(csvFile).pipe(parser);