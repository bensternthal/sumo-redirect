var conf = require('./lib/conf');
var fs = require('fs');
var parse = require('csv-parse');
var request = require('request');
var sleep = require('system-sleep');
var chalk = require('chalk');

var urls = new Array();
var csvFile = conf.get('csv');
var failureLog = './logs/failureLog.txt';
var requestErrorLog = './logs/requestErrorLog.txt';
var successLog = './logs/successLog.txt';
var sleepDelayMS = conf.get('sleepDelayMS');
var successCount = 0;
var failureCount = 0;
var errorCount = 0;

/* Diable SSL Checking GLobally */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

/* Options for HTTP Get Request, remove Auth if you are not testing stage */
var requestOptions = {
    auth: {
        username: conf.get('username'),
        password: conf.get('password')
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
        /*  Object For Storing Attributes of A CSV Row Being Tested 
         *  Manyally specify csv location depending on file, usually 3, 6 
        */
        var csvRow = {
            originalURL: row[3],
            finalURL: row[6],
            finalURLID: null,
            responseURLID: null
        };
        
        //fix
        csvRow.finalURLID = getID(csvRow.finalURL);
        
        /* Sleep for N milliseconds to not kill the server and also to prevent aysnc issues 
         * Show a "." so we know its working and actually test the row.
         */
        sleep(sleepDelayMS);
        process.stdout.write(".");
        testURL(csvRow);
    });
    
    // All done show summary
    displaySummary();
});


 /* Requests original url and tests against url specified */
function testURL(csvRow) {
    
    // Set URL to test
    requestOptions.url = csvRow.originalURL;

    request(requestOptions, function (error, response, body) {
        if (error) {
            writeResultsNEW('error', response, csvRow, error);
        } else {
            /* Get id from finalURL(CSV) and the actual final url returned by lithium */    
            csvRow.responseURLID = getID(response.request.uri.href);
            
            /* Test If ID From CSV Matches Returned ID From Lithium */
            if(csvRow.finalURLID === csvRow.responseURLID) {
                writeResultsNEW('success', response, csvRow);
            } else {
                writeResultsNEW('failure', response, csvRow);

            }            
        }
    });
}

/* if Final URL ID Matches URL (after all the redirects) record success if not record failure */
function writeResultsNEW(responseType, response, csvRow, error) {
    switch (responseType) {
      case 'success':
        fs.appendFileSync(successLog, 'Success: ' + csvRow.originalURL + " , " + csvRow.finalURL + "\n");
        successCount++;      
        break;
      case 'failure':
        fs.appendFileSync(failureLog, 'Failure: ' + csvRow.originalURL + " , " + csvRow.finalURL + " , " + response.request.uri.href +
        " , CSV Supplied ID: " + csvRow.finalURLID + " , Lithium Returned ID: " + csvRow.responseURLID + '\n');
        failureCount++;      
        break;
      case 'error':
        fs.appendFileSync(requestErrorLog, error + ' ' + csvRow.originalURL + "\n");
        errorCount++;
        break;
      default:
        fs.appendFileSync(requestErrorLog, 'Unknown Error' + ' ' + csvRow.originalURL + "\n");
    }
}

/* Given a url https://foo.bar/foo/1234 returns only the integer after the last "/". If
 * something unexpected happens adds some strings that will be logged to help debug */
function getID (url) {
    var n = url.lastIndexOf('/');

    if (n !== -1) {
        var id = parseInt(url.substring(n + 1));
        if (isNaN(id)) {
            return "ID Returned Is Not A Number";
        } else {
            return id;
        }
    } else {
        return "ID Missing";
    }
}

/* Summarizes output */
function displaySummary() {
    console.log("\n" + chalk.green.bold(('Success: ') + successCount)); 
    console.log(chalk.red.bold(('Failure: ') + failureCount));
    console.log(chalk.magenta.bold(('Errors: ') + errorCount)); 
}

// Read CSV File, kicks off everything
fs.createReadStream(csvFile).pipe(parser);
