var app = require('../../server/server');
var csv = require("fast-csv");
var fs  = require('fs');
const readline = require('readline');

module.exports = function(RegressionResults) {

    var self = RegressionResults;
    var curDate = new Date();
    var RegressionResultsFolder = app.dataSources.filesystem.settings.root;

    //import from CSV
    RegressionResults.remoteMethod (
        'importCSV', 
        {      
            accepts: [
                { arg: 'filePath', type: 'string' },
                { arg: 'buildNumber', type: 'string' }
            ],
            http: {
                path: '/importCSV', verb: 'get'
            },            
            returns: [
                { arg: 'result', type: 'object' }
            ]     
        }
    );

    //importECRM from File
    RegressionResults.remoteMethod (
        'importECRM', 
        {      
            accepts: { arg: 'buildNumber', type: 'string' },
            http: {
                path: '/importECRM', verb: 'get'
            },            
            returns: [
                { arg: 'result', type: 'object' }
            ]     
        }
    );

    //get getbuildNumbers only
    RegressionResults.remoteMethod (
        'getBuildNumbers', 
        {      
            accepts: { arg: 'groupName', type: 'string' },
            http: {
                path: '/getBuildNumbers', verb: 'get'
            },            
            returns: [
                { arg: 'result', type: 'object' }
            ]     
        }
    );

    //import Protractor Results from JSON
    RegressionResults.remoteMethod (
        'importProtractorResults', 
        {      
            accepts: [
                { arg: 'buildNumber', type: 'string' }
            ],
            http: {
                path: '/importProtractorResults', verb: 'get'
            },            
            returns: [
                { arg: 'result', type: 'object' }
            ]     
        }
    );

    //import UNIT Test Results
    RegressionResults.remoteMethod (
        'importUnitTestResults', 
        {      
            accepts: { arg: 'buildNumber', type: 'string' },
            http: {
                path: '/importUnitTestResults', verb: 'get'
            },            
            returns: [
                { arg: 'result', type: 'object' }
            ]     
        }
    );

    
    ////////////////////////////////////////////////////////////////////
    //Commons
    ////////////////////////////////////////////////////////////////////
    function respond (cb, status, data) {

        var statusCode = status ? 200 : 200;
        var response = {
            status: statusCode,
            success: status,
            data: data
        };
        cb(null, response);                
    }

    function getDistinctBuildNumbers (groupName) {

        return new Promise (function (resolve, reject) {
            
            var buildNumbers = app.models.Role.getDataSource().connector.collection(app.models.RegressionResults.modelName);
            buildNumbers.distinct("buildNumber", {"group.name": groupName }, cbGetAllBuildNumbers);      

            function cbGetAllBuildNumbers (err, results) {

                if (err) {
                    resolve(results);
                }
                else {
                    resolve(results);                 
                }
            }
        });
    }
    
    function fixFileName (fileName) {

        fileName = fileName.replace(/\\/g, '//');
        fileName = fileName.replace('////', '//');
        
        return fileName;                            
    }
        
    ////////////////////////////////////////////////////////////////////
    //remote methods
    ////////////////////////////////////////////////////////////////////
    RegressionResults.importCSV = function (filePath, buildNumber, cb) {
                
        var invalidData = ['Collection', 'Total', 'Passing rate %', 'null', ''];
        var responseMessage = {
                    totalRecords: 0,
                    successCount: 0,
                    failedCount: 0,
                    jobCompleted: 0
                };
        
        if ( !filePath || filePath.length <= 0 ) {  
            throw "missing: filePath";
        }

        if ( !buildNumber || buildNumber.length <= 0 ) {  
            throw "missing: buildNumber";
        }


        try {
            readCSV();
        }
        catch (ex) {
            console.log('Exception Accored: ', err);
        }

        
        function readCSV() {
            csv
            .fromPath(filePath)
            .on("data", function(data) {

                if ( data[0] && data[0].length > 0 && invalidData.indexOf(data[0]) <= 0 ) {

                    var itemData = {}; 
                    itemData.name = data[0].split('/');
                    itemData.name = itemData.name[1] ? itemData.name[1] : itemData.name;
                    itemData.dateCreated = data[2] ? data[2] : null;
                    itemData.count = data[3] ? +data[3] : 0;
                    itemData.failed = data[4] ? +data[4] : 0;

                    if ( itemData.name !== "" && typeof itemData.name === "string" && itemData.name.length > 0 ) {
                        
                        responseMessage.jobCompleted++;
                        app.models.TeamUseCases.findOne({where: {"name": itemData.name}}, function (err, resp) {

                            if (err) {
                                responseMessage.failedCount++;
                                responseMessage.jobCompleted++;
                                return;
                            }
                            else {
                                
                                if ( null === resp ) {
                                    responseMessage.failedCount++;
                                    responseMessage.jobCompleted++;
                                    return;
                                }

                                var item,
                                team = resp.team ? resp.team : null,
                                group = resp.group ? resp.group : null;
                                
                                if ( itemData.name !== "" && typeof itemData.name === "string" && itemData.name.length > 0 ) {
                                    
                                    item = {
                                        name: itemData.name,
                                        dateCreated: itemData.dateCreated,
                                        totalAssertions: itemData.count + itemData.failed,
                                        successCount: itemData.count,
                                        failedCount: itemData.failed,
                                        team: team,
                                        group: group,
                                        buildNumber: buildNumber
                                    };
                                    
                                    RegressionResults.create( item, cbCreateRegressionResults);                                                    
                                } else {
                                    responseMessage.failedCount++;
                                    responseMessage.jobCompleted++;
                                }
                            }

                            function cbCreateRegressionResults (err, result) {
                                
                                if (err) {
                                    responseMessage.failedCount++;
                                }
                                else {
                                    responseMessage.successCount++;
                                }

                                responseMessage.jobCompleted++;
                            }
                        });
                    }                   
                }    
                else if ( invalidData.indexOf(data[0]) > 0 && data[0] == 'Total' ) {
                    
                    respond (cb, true, responseMessage);
                }
            })
            .on("end", function() { 
                
            });
        }
    };

    RegressionResults.importECRM = function (buildNumber, cb) {
                
        var groupName = "RM_Newman";
        if ( !buildNumber || buildNumber.length <= 0 ) {  
            throw "missing: buildNumber";
        }

        try {
            getDistinctBuildNumbers(groupName).then(function(buildNumbers) {  
                
                if ( buildNumbers.indexOf(buildNumber) >= 0 ) {
                    var msg = `Duplicate buildNumber#${buildNumber}. Already in the System.`;
                    respond (cb, false, msg);
                    return;
                }
                
                app.models.TeamUseCases.find({"where": {"group.name": {"inq": ["RM_Newman", "ECM_Newman"]}} }, cbTeamUseCases);
            });
        }
        catch (ex) {
            console.log('Exception Accored: ', ex);
        }        

        function cbTeamUseCases (err, results) {

            if (err) { }
            else {
                var responseMessage = {
                    totalRecords: results.length,
                    successCount: 0,
                    failedCount: 0,
                    jobCompleted: 0,
                    failed: []
                };

                results.forEach(function(result) {

                    var item, jsonObj, teamUseCase,
                        team = result.team ? result.team : null,
                        group = result.group ? result.group : null,
                        fileName = RegressionResultsFolder + result.mappedFileName,
                        totalAssertions = 0, successCount = 0, failedCount = 0;

                    if ( null === result || result.mappedFileName === "" ) {
                        
                        responseMessage.failedCount++;
                        responseMessage.jobCompleted++;
                        responseMessage.failed.push(group.name + "::" + result.name);
                        if ( responseMessage.jobCompleted == responseMessage.totalRecords ) {
                            respond (cb, false, responseMessage);
                        }                    
                        return;
                    }
                    
                    fileName  = fixFileName(fileName);
                    if ( fs.existsSync(fileName) ) {
                        
                        fs.readFile(fileName, 'utf8', (err, jsonString) => {
                        
                            if (err) {
                                responseMessage.failedCount++;
                                responseMessage.failed.push(group.name + "::" + result.name);
                            }

                            jsonObj = JSON.parse(jsonString);
                            if ( jsonObj && typeof jsonObj === "object" ) {

                                teamUseCase = {
                                    "id": result.id,
                                    "mappedName": result.mappedName,
                                    "mappedFileName": result.mappedFileName
                                };
                                
                                totalAssertions = jsonObj.run.stats.assertions.total + jsonObj.run.stats.assertions.failed; 
                                successCount = jsonObj.run.stats.assertions.total;
                                failedCount = jsonObj.run.stats.assertions.failed;

                                item = {
                                    name: result.name,
                                    description: result.name,
                                    dateCreated: curDate,
                                    totalAssertions: totalAssertions,
                                    successCount: successCount,
                                    failedCount: failedCount,
                                    team: team,
                                    group: group,
                                    buildNumber: buildNumber,
                                    teamUseCase: teamUseCase
                                };

                                RegressionResults.create( item, cbCreateRegressionResults);
                                function cbCreateRegressionResults (err, result) {
                                    if (err) {
                                        responseMessage.failedCount++;
                                        responseMessage.failed.push(group.name + "::" + result.name);
                                    }
                                    else {
                                        responseMessage.successCount++;
                                    }

                                    responseMessage.jobCompleted++;                                        
                                    if ( responseMessage.jobCompleted == responseMessage.totalRecords ) {
                                        respond (cb, true, responseMessage);
                                    }                                    
                                }
                                
                            } else {
                                responseMessage.failedCount++;
                                responseMessage.failed.push(group.name + "::" + result.name);
                            }
                            
                        });
                    } else {
                        
                        responseMessage.failedCount++;
                        responseMessage.jobCompleted++; 
                        responseMessage.failed.push(group.name + "::" + result.name);
                        if ( responseMessage.jobCompleted == responseMessage.totalRecords ) {
                            respond (cb, false, responseMessage);
                        }
                    }                    

                }, this);

            }
        }   
    };

    RegressionResults.getBuildNumbers = function (groupName, cb) {

        getDistinctBuildNumbers(groupName).then(function(results) { 

            var successORFail = results.length > 0 ? true : false;
            respond (cb, successORFail, results);
        });           
    };

    RegressionResults.importProtractorResults = function (buildNumber, cb) {
                
        var groupName = "Protractor_Results";
        
        if ( !buildNumber || buildNumber.length <= 0 ) {  
            throw "missing: buildNumber";
        }
        
        try {
            getDistinctBuildNumbers(groupName).then(function(buildNumbers) {  
                
                if ( buildNumbers.indexOf(buildNumber) >= 0 ) {
                  
                    var msg = `Duplicate buildNumber#${buildNumber}. Already in the System.`;
                    respond (cb, false, msg);
                    return;
                }
                
                //app.models.TeamUseCases.find({where: {"group.name":{"eq": groupName}}}, addProtractorResults);
                app.models.TeamUseCases.find({where: {"group.name":groupName}}, addProtractorResults);
            });
            
        }
        catch (ex) {
            console.log('Exception Accored: ', ex);
        }        

        function addProtractorResults (err, results) {
            
            if (err) { }
            else {
                var responseMessage = {
                    totalRecords: 0,
                    successCount: 0,
                    failedCount: 0,
                    jobCompleted: 0,
                    failed: []
                };
                
                results.forEach(function(result) {
                    
                    var item, jsonObj, teamUseCase, counters, suite,
                        team = result.team ? result.team : null,
                        group = result.group ? result.group : null,
                        fileName = RegressionResultsFolder + result.mappedFileName;
                        

                    if ( null === result || result.mappedFileName === "" ) {
                        
                        responseMessage.failedCount++;
                        responseMessage.jobCompleted++;
                        responseMessage.failed.push(group.name + "::" + result.name);                        
                        return;
                    }
                    
                    fileName  = fixFileName(fileName);                    
                    if ( fs.existsSync(fileName) ) {
                        
                        fs.readFile(fileName, 'utf8', (err, jsonString) => {
                        
                            if (err) {
                                responseMessage.failedCount++;
                                responseMessage.failed.push(group.name + "::" + result.name);
                                throw "Error File Reading: " + err;
                            }

                            jsonObj = JSON.parse(jsonString);                                
                            if ( jsonObj && typeof jsonObj === "object" ) {

                                teamUseCase = {
                                    "id": result.id,
                                    "mappedName": result.mappedName,
                                    "mappedFileName": result.mappedFileName
                                };

                                for (var key in jsonObj) {
                                    if (jsonObj.hasOwnProperty(key)) {
                                        
                                        suite = jsonObj[key];
                                        responseMessage.totalRecords++;
                                        
                                        counters = getSuccessFailedCount(suite.specs);
                                        item = {
                                            name: suite.description,
                                            description: suite.fullName,
                                            dateCreated: curDate,
                                            totalAssertions: (counters.successCount + counters.failedCount),
                                            successCount: counters.successCount,
                                            failedCount: counters.failedCount,
                                            team: team,
                                            group: group,
                                            buildNumber: buildNumber,
                                            teamUseCase: teamUseCase
                                        };

                                        RegressionResults.create( item, cbCreateRegressionResults);
                                    }
                                }

                                
                                function cbCreateRegressionResults (err, _result) {
                                    if (err) {
                                        responseMessage.failedCount++;
                                        responseMessage.failed.push(group.name + "::" + _result.name);
                                    }
                                    else {
                                        responseMessage.successCount++;
                                    }

                                    responseMessage.jobCompleted++;                                        
                                    if ( responseMessage.jobCompleted == responseMessage.totalRecords ) {
                                        respond (cb, true, responseMessage);
                                    }                                    
                                }

                                function getSuccessFailedCount (specs) {
                                    var output = {
                                        successCount: 0,
                                        failedCount: 0
                                    };

                                    specs.forEach(function(spec) {
                                        output.successCount += spec.passedExpectations.length;
                                        output.failedCount += spec.failedExpectations.length;
                                    }, this);

                                    return output;
                                }
                                
                            } else {
                                responseMessage.failedCount++;
                                responseMessage.failed.push(group.name + "::" + result.name);
                                throw "Bad Json String: " + fileName;
                            }
                            
                        });
                    } else {
                        
                        responseMessage.failedCount++;
                        responseMessage.jobCompleted++; 
                        responseMessage.failed.push(group.name + "::" + result.name);
                    }                    

                }, this);

            }
        }   
    };
    
    RegressionResults.importUnitTestResults = function (buildNumber, cb) {
                
        var groupName = "Unit_Test";

        if ( !buildNumber || buildNumber.length <= 0 ) {  
            throw "missing: buildNumber";
        }

        try {
            getDistinctBuildNumbers(groupName).then(function(buildNumbers) {  
                
                if ( buildNumbers.indexOf(buildNumber) >= 0 ) {
                    var msg = `Duplicate buildNumber#${buildNumber}. Already in the System.`;
                    respond (cb, false, msg);
                    return;
                }
                
                //app.models.TeamUseCases.find({"where":{"group.name":{eq: groupName}}}, addUnitTestResults);
                app.models.TeamUseCases.find({"where":{"group.name":groupName}}, addUnitTestResults);
            });            
            
        }
        catch (ex) {
            console.log('Exception Accored: ', ex);
        }        

        function addUnitTestResults (err, results) {
            
            if (err) { }
            else {
                var responseMessage = {
                    totalRecords: 0,
                    successCount: 0,
                    failedCount: 0,
                    jobCompleted: 0,
                    failed: []
                };
                
                results.forEach(function(result) {

                    var item, jsonObj, teamUseCase,
                        team = result.team ? result.team : null,
                        group = result.group ? result.group : null,
                        unitTestFolder = RegressionResultsFolder + result.mappedFileName,
                        fileNamePattern = new RegExp(/^\d+$/),
                        teamNamePattern = new RegExp(/\w/g),
                        teamName = "",
                        fName = "",
                        lineData = "",
                        itemData = {};
                        
                    unitTestFolder  = fixFileName(unitTestFolder);             
                    fs.readdirSync(unitTestFolder).forEach(file => {

                        //exameple name: 17.0 (0181)-20170613.log
                        fName = file.split('-');  
                        if ( fileNamePattern.test(fName[1].substr(0,3))  ) {
                            
                            fileName = unitTestFolder + file;
                            lineRead = readline.createInterface({
                                input: fs.createReadStream(fileName)
                            });
                            
                            lineRead.on('close', (line) => {
                                setTimeout(function () {
                                    respond (cb, true, responseMessage);
                                }, 500)                                
                            });

                            lineRead.on('line', (line) => {
                                
                                if (line.length > 0) {

                                    if ((line.substr(0,1) === '*' && line.indexOf("Very Important") > 0)) {
                                    }
                                    else if (line.substr(0,1) === '*' && line.indexOf("Cases Starting") > 0 && line.indexOf("Very Important") <= 0) {
                                        //************************Raiden Cases Starting*************************
                                        teamName = line.match(teamNamePattern);
                                        teamName = teamName.join("").replace("CasesStarting","").replace("Test", "");
                                        team.name = teamName; //TODO: need to clean the name
                                    }
                                    // else if ( line.substr(0,1) === '*' && line.indexOf("Cases Finished") > 0 ) { } 
                                    // else if ( line.substr(0,5) === 'Total' ) { } 
                                    else if ( line.split("|").length > 2 ) {
                                        
                                        itemData = {};
                                        lineData = line.split('|');
                                        
                                        itemData.status = lineData[0],
                                        itemData.name = lineData[1],
                                        itemData.message = lineData[2],
                                        itemData.date = lineData[3];

                                        if ( itemData.status != 'Success' && itemData.status != 'Failed' ) {
                                            responseMessage.failedCount++;
                                            responseMessage.failed.push(group.name + "::" + line);
                                            return;
                                        }

                                        teamUseCase = {
                                            "id": result.id,
                                            "mappedName": result.mappedName,
                                            "mappedFileName": fileName
                                        };

                                        item = {
                                            name: itemData.name,
                                            description: itemData.message,
                                            dateCreated: curDate,
                                            totalAssertions: 1,
                                            successCount: (itemData.status === 'Success') ? 1 : 0,
                                            failedCount: (itemData.status === 'Failed') ? 1 : 0,
                                            team: team,
                                            group: group,
                                            buildNumber: buildNumber,
                                            teamUseCase: teamUseCase
                                        };
                                        
                                        responseMessage.totalRecords++;
                                        RegressionResults.create( item, cbCreateRegressionResults);                                        
                                        
                                        function cbCreateRegressionResults (err, _result) {
                                            if (err) {
                                                responseMessage.failedCount++;
                                                responseMessage.failed.push(group.name + "::" + _result.name);
                                            }
                                            else {
                                                responseMessage.successCount++;
                                            }

                                            responseMessage.jobCompleted++;         
                                        }                                        
                                    }
                            
                                }                               
                            });
                        }
                    });                   
                                       

                }, this);

            }
        }  
    };
    
};
