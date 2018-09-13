// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // set our port


//JSONS
var allSegmentsJSONResponse = require('./json/get-all-segments.json');
var metricsJSONResponse = require('./json/metrics-data.json');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our TPG mock service api!' });
});

var apiRouter = express.Router();
// GET segments call
apiRouter.route('/segments/v1/getall')
    .get(function(req, res) {

        console.log('GET segments call');
        res.json(allSegmentsJSONResponse);
    });

// GET metrics call
apiRouter.route('/metrics/v1/get')
    .get(function(req, res) {

        console.log('GET metrics call');
        res.json(metricsJSONResponse);
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouter);
app.use('/', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('TPG mock service running on port ' + port);
