// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var path       = require('path');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');

var mongoose   = require('mongoose');

// var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
//                 replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };       
 
// var mongodbUri = 'mongodb://mean:Gm22$813@ds025583.mlab.com:25583/test1';
 
mongoose.connect('mongodb://mean:Gm22$813@ds025583.mlab.com:25583/test1');

var conn = mongoose.connection;             
 
conn.on('error', console.error.bind(console, 'connection error:'));


//mongoose.connect('mongodb://heroku_hdvt78rh:au35mptost197hskt8ii2lo93k@ds011374.mlab.com:11374/heroku_hdvt78rh');

var Contact     = require('./app/models/contact');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000'}));

var port = process.env.PORT || 3002;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// router.get('/', function(req, res, next) {
//     res.json({ message: 'hooray! welcome to our api!' });   
// });

var publicPath = path.resolve(__dirname,'./');

app.use(express.static(publicPath));

// more routes for our API will happen here

// on routes that end in /contacts
// ----------------------------------------------------
router.route('/contacts')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        console.log('something happen');
        console.log(req.body);
        
        var contact = new Contact();      // create a new instance of the Contact model
        contact.email = req.body.email;
        contact.firstName = req.body.firstName;
        contact.lastName = req.body.lastName;
        contact.company = req.body.company;

        //push in phoneNumber docyment array
        contact.phoneNumber.push({
            areaCode: req.body.areaCode, 
            number: req.body.number, 
            extension: req.body.extension
        });

        //push in physicalAddress docyment array
        contact.physicalAddress.push({
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            zipFirstFive: req.body.zipFirstFive,
            zipPlusFour: req.body.zipFour
            // countryId: contact.,
            // stateId: [State]
        });

        // save the contact and check for errors
        contact.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Contact created!' });
        });
        
    })

     //get all the contacts (accessed at GET http://localhost:8080/api/contacts)
    .get(function(req, res) {
        Contact.find(function(err, contacts) {
            if (err)
                res.send(err);

            res.json(contacts);
        });
    });

    // on routes that end in /contacts/:contact_id
	// ----------------------------------------------------
router.route('/contacts/:contact_id')

    // get the contact with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Contact.findById(req.params.contact_id, function(err, contact) {
            if (err)
                res.send(err);
            res.json(contact);
        });
    })

    // update the contact with this id (accessed at PUT http://localhost:8080/api/contact/:contact_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Contact.findById(req.params.contact_id, function(err, contact) {

            if (err)
                res.send(err);

            contact.name = req.body.name;  // update the contacts info

            // save the contact
            contact.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Contact updated!' });
            });

        });
    })

    // delete the contact with this id (accessed at DELETE http://localhost:8080/api/contacts/:contact_id)
    .delete(function(req, res) {
        Contact.remove({
            _id: req.params.contact_id
        }, function(err, contact) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);