## Install
1. run ```npm install```
1. Copy ```local.json.dist``` to ```local.json```
1. Fill in values, username/pass only needed if testing stage. CSV is path to csv file './csv/test.csv'
1. Create directory ```/logs``` in project
1. Create log files in /logs (I should do this auto-magically but this is a rush)
	1. failureLog.txt
	2. requestErrorLog.txt
	3. successLog.txt

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
