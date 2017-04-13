## Install
1. run ```npm install```
1. Copy ```local.json.dist``` to ```local.json```
1. Fill in values, username/pass only needed if testing stage. CSV is path to csv file './csv/test.csv'. sleepDelayMS is rate limiting in MS.
1. Create directory ```/logs``` in project. Note log files are appended. If you want to run this multiple times, you may want to clear the log files first.


## Test.csv
Requires stage credentials.

1. First result should generate request error.
1. Second result should generate url match failure and report error with ID
1. Third result should work

## Logs

**successLog**

Success log shows when the id in finalURL (from CSV file) and the ID from the final URL from lithium *matches*.

**failureLog**

Failure log shows when the id in finalURL (from CSV file) and the ID from the final URL from lithium *does not match*.

**errorLog**

Displays connection errors.
