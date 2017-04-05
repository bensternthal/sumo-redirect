1. run ```npm install```
1. In app.js populate:
 	1. username
	2. password
	3. path to csv file
1. Create directory ```/logs``` in project
1. Create log files in /logs (I should do this auto-magically but this is a rush)
	1. failureLog.txt
	2. requestErrorLog.txt
	3. successLog.txt

## Test.csv
1. First result should generate request error.
1. Second result should generate url match failure.
1. Third result should work

## Log Format


**successLog**

```Success: ' + originalURL + " , " + finalURL```

Success log shows urls where the finalURL(csv) specified matches the actual end point

**failureLog**

```Error: ' + originalURL + " , " + finalURL + " , " + response.request.uri.href```

Failure log shows finalURL (from CSV file) and the href that is the actual endpoint.

**errorLog**

Displays connection errors.
