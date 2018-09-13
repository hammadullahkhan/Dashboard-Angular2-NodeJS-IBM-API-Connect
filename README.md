# Dashboard App
Dashboard app based on MEAN Stack.

Prerequisites
- MongoDB (default settings)
- Node
- NPM

MongoDB
- MongoDB version 3.4 or latest
- start mongo server from CLI: mongod.exe

- MondogDB restore metaDB (this will create the db named dashboard): 
- mongorestore --db dashboard "C:\data\db\dashboard\2017-06-19-5-08pm\dashboard"

- MondogDB backup (whenever need to backit up): 
- mongodump --db dashboard --out "C:\data\db\dashboard\2017-07-27-2-17pm"

Install API Node Modules
- cd api
- Run command: npm install

Create ImportFolder
- C:\Projects\dashboardData
# set the path in serverApp/server/datasources.json in the fileSystem:root as "C:\\Projects\\dashboardData"

Starting API Server
- cd into the {project folder}
- cd api
- MongoDB connection settings file - /serverApp/server/datasources.json
- node server/server.js
# Web server listening at: http://localhost:3000
# Browse your REST API at http://localhost:3000/explorer

Import Data
# Sample API Call for Data Import
# http://localhost:3000/api/RegressionResults/importECRM?buildNumber=1400
# http://localhost:3000/api/RegressionResults/importProtractorResults?buildNumber=1400
# http://localhost:3000/api/RegressionResults/importUnitTestResults?buildNumber=1400

# Import Utilities required buildNumber to be passed.
# It also try to read data from a pre-specified location mentioned in serverApp/server/datasources.json in the fileSystem:root as "C:\\Projects\\dashboardData"


Web App Installation
- Run command: cd ../clientApp
- follow the README.md from there.
# This will give you option to start the API Server or WebApp. 

# Starting WebApp
# Open another command prompt and run : npm run start
# You will get
# ** NG Live Development Server is running on http://localhost:4200 **

