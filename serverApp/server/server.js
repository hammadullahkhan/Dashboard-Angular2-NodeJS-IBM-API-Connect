'use strict';
require('ts-node/register');
var loopback     = require('loopback');
var boot         = require('loopback-boot');
var cookieParser = require('cookie-parser');

var app = module.exports = loopback();

app.use(cookieParser());

/*function test() {
  //console.log('test working');
  var appModels = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'Groups', 'Teams', 'TeamUseCases', 'RegressionResults'];

  var ds = app.dataSources.mydb;
  ds.isActual(appModels, function(err, actual) {
    if (!actual) {
      ds.autoupdate(appModels, function(err) {
        if (err) throw (err);
      });
    }
  });
};*/

app.start = function() {
  // start the web server
  var server = app.listen(function() {

    //test();
    app.emit('started', server);
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
