'use strict';

var app = require('../../server/server');
var fs  = require('fs');
//var download = require('download');

import { ITeamUseCase } from '../../../webapp_oden/src/app/services/dashboard/interfaces/ITeamUseCase';

module.exports = function(TeamUseCases: ITeamUseCase) {

    var self = TeamUseCases;

    //getFile
    TeamUseCases.remoteMethod (
        'getFile', 
        {      
            accepts: [
                { arg: 'fileName', type: 'string' }
            ],
            http: {
                path: '/getFile', verb: 'get'
            },            
            returns: [
                { arg: 'result', type: 'object' }
            ]     
        }
    );

    //download file
    TeamUseCases.remoteMethod (
        'downloadFile', 
        {      
            isStatic: true,
            accepts: [
                { arg: 'fileName', type: 'string' },
                {arg: 'res', type: 'object', 'http': {source: 'res'}}
            ],
            http: {
                path: '/downloadFile', verb: 'get'
            },            
            returns: [
                { arg: 'body', type: 'file', root: true },
                { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
                { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
            ]     
            /*returns: [
                {arg: 'body', type: 'file', root: true},
                {arg: 'Content-Type', type: 'string', http: { target: 'header' }}
            ]*/
            //returns: {},
        }
    );

    
    ////////////////////////////////////////////////////////////////////
    //Commons
    ////////////////////////////////////////////////////////////////////
    function respond (cb: any, status: any, data: any) {

        var statusCode = status ? 200 : 200;
        var response = {
            status: statusCode,
            success: status,
            data: data
        };
        cb(null, response);                
    }

    function getFileContents (fileName: string): any {
        
        return new Promise<any>((resolve: any, reject: any) => { 
            
            var TeamUseCasesFolder = "C:\\Projects\\dashboardData";
            fileName = TeamUseCasesFolder + fileName;
            if ( fs.existsSync(fileName) ) {
                
                fs.readFile(fileName, 'utf8', (err: any, str: string) => {
                
                    if (err) {                        
                        reject("Error File Reading: ");
                        //throw "Error File Reading: " + err;                        
                    }

                    resolve(str);
                    
                });
            } else {
                reject("FileNotFound: " + fileName);
                //throw "FileNotFound: " + fileName;
            }
        })
        /*.then(function(onSuccess: any) {  
                console.log('onSuccess:', onSuccess);
            }, function (onReject: any) {
                console.log('onReject:', onReject);
            }
        )
        .catch(function (onError: any) {
                console.log('onError:', onError);
        })*/;
        
    }
        
    ////////////////////////////////////////////////////////////////////
    //remote methods
    ////////////////////////////////////////////////////////////////////
    TeamUseCases.getFile = function (fileName: string, cb: any) {
        
        if ( !fileName || fileName.length <= 0 ) {  
            throw "missing: fileName";
        }

        try {
            getFileContents(fileName).then(function(fileContent: any) {  

                if ( fileName.substr(-4) == "html" && fileContent.length > 0 && fileName.search("jasmine-test-results") <= 0 )  {
                    let lastIndex = fileContent.lastIndexOf("<body>")
                    fileContent = fileContent.slice(lastIndex+7, -16);
                }                

                respond (cb, true, fileContent);

            }, function (err: any) {
                //console.log('gethtmlfile', err)
            });
        }
        catch (ex) {
            //console.log('Exception Accored: ', ex)
        } 
    };

    TeamUseCases.downloadFile = function (fileName: string, res: any, cb: any) {
        
        if ( !fileName || fileName.length <= 0 ) {  
            throw "missing: fileName";
        }
       
        try {
            
            getFileContents(fileName).then(function(fileContent: any) {  
                
                
                /*var datetime = new Date();
                res.set('Content-Type','application/download');
                res.set('Content-Type','application/json');
                res.set('Content-Disposition','attachment;filename=Data.json');
                var TeamUseCasesFolder = "C:\\Projects\\dashboardData";
                
                fileName = TeamUseCasesFolder + fileName;*/
                //res.send(fileContent); //@todo: insert your CSV data here.
                //cb(null, res.send(fileContent));     

                res.set('Content-Type','application/download');
                res.set('Content-Type','application/json');
                res.set('Content-Disposition','inline;attachment;filename=Data.json');
                res.send(fileContent); //@todo: insert your CSV data here.
                //cb(null, res.send(fileContent), 'application/octet-stream;Content-Type:application/download;Content-Type:application/json;Content-Disposition:inline;filename=Data.json;'); 
                //cb(null, fileContent, 'Content-Type:application/download;Content-Type:application/json;Content-Disposition:inline;filename=Data.json;');         
                //cb(null, fileContent, 'application/octet-stream;Content-Type:application/download;Content-Type:application/json;Content-Disposition:inline;filename=Data.json;');
                //cb(null, fileContent, 'application/octet-stream;Content-Type:application/download;Content-Type:application/json;Content-Disposition:inline;filename=Data.json;');

            }, function (err: any) {
                //console.log('gethtmlfilie', err)
            });

        }
        catch (ex) {
            //console.log('Exception Accored: ', ex)
        } 
    };
    
};

