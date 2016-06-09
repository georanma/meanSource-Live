// app/models/contact.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ContactSchema   = new Schema({
    email: String,
    company: String,
    firstName: String,
    lastName: String,
    phoneNumber: [PhoneNumber],
    physicalAddress: [PhysicalAddress]
});

var PhoneNumber = new Schema({
	areaCode: Number,
	number: Number,
	extension: Number
});

var PhysicalAddress = new Schema({
	address1: String,
	address2: String,
	city: String,
	zipFirstFive: Number,
	zipPlusFour: Number,
	countryId: [Country],
	stateId: [State]
});

var Country = new Schema({
	code: String,
	Name: String
});

var State = new Schema({
	code: String,
	Name: String
});




module.exports = mongoose.model('Contact', ContactSchema);
