var _ = require('underscore')._,
_natural = require('natural'),
_fs = require('fs'),
moment = require('moment'),
Helpers = require('./Helpers'),
PersonalCorpus = require('./PersonalCorpus'),
PatternHelper = require('./PatternHelper'),
Normalizer = require('./Normalizer'),
SMSSentiment = require('./SMSSentiment');

var _helpers = new Helpers();
var _patternHelper = new PatternHelper();
var _normalizer = new Normalizer();
var _smsSentiment = new SMSSentiment();
var _tokenizer = new _natural.WordTokenizer();

function BeingObjectGenerator() {
	this.infoFile = '/info.json';
	this.corpusFile = '/corpus.json';
}

/* {
	name: "string",
	age: "string",
	sex: "string",
	location: "string",
	interests: []
} */
BeingObjectGenerator.prototype.getBeingObject = function(corpusPath, callback) {
	
	var self = this;
	_fs.readFile(corpusPath + self.infoFile, "utf-8", function(err, data){
		
		if (err) throw err;
		var info = JSON.parse(data);

		beingObj = {};
		beingObj.id = _helpers.generateID(40);
		beingObj.name = info.name;
		beingObj.DOB = info.DOB;
		beingObj.age = moment().diff(moment(info.DOB, "MM/DD/YYYY"), 'years');
		beingObj.sex = info.sex;
		beingObj.location = info.location;
		beingObj.phoneNumber = info.phoneNumber;
		beingObj.interests = info.interests;
		beingObj.model = {};

		var personalCorpus = new PersonalCorpus(corpusPath + self.corpusFile, function(corpus){

			callback(beingObj);
		});
	});
}

BeingObjectGenerator.prototype.regenerateBeingModel = function(beingObj) {

}

module.exports = BeingObjectGenerator;
