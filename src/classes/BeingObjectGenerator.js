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
var _personalCorpus;

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
		

		_personalCorpus = new PersonalCorpus(corpusPath + self.corpusFile, function(corpus){

			beingObj.model = {};
			beingObj.model.ngrams = _getNgrams();
			console.log(JSON.stringify(beingObj.model.ngrams.bigram));
			callback(beingObj);
		});
	});
}

BeingObjectGenerator.prototype.regenerateBeingModel = function(beingObj) {

}

function _getNgrams() {

	var self = this;
	var messagesFromBeing = _.filter(_personalCorpus.messages, function(message){
		return message.from == "Me";
	});

	var messageStartToken = "<MESSAGE>";
	var messageEndToken = "</MESSAGE>";
	var words = _getWords();

	return {
		words: words,
		bigram: _getBigram()
	};

	function _getWords() {
		
		var words = [];

		_.each(messagesFromBeing, function(message){
			_.each(message.sentences, function(sentence){
				_.each(sentence.words, function(word){
					if (_.indexOf(words, word) == -1) {
						words.push(word);
					}
				});
			});
		});
		
		words = _.sortBy(words, function (word) {return word}).reverse();
		words.unshift(messageEndToken);
		words.unshift(messageStartToken);
		return words;
	}

	function _getBigram() {

		// initializing a javascript array with
		// values is a pain in the ass...
		var bigram = new Array(words.length);
		for (var i = 0; i < bigram.length; i++) {
			bigram[i] = [];
			for (var j = 0; j < bigram.length; j++) {
				bigram[i][j] = 0;
			}	
		}

		var previousWord = "";

		_.each(messagesFromBeing, function(message){
			previousWord = messageStartToken;
			_.each(message.sentences, function(sentence){
				_.each(sentence.words, function(word){
					var previousIndex = _.indexOf(words, previousWord);
					var thisIndex = _.indexOf(words, word);
					bigram[previousIndex][thisIndex]++;
					previousWord = word;
				});
			});

			var previousIndex = _.indexOf(words, previousWord);
			var thisIndex = _.indexOf(words, messageEndToken);
			bigram[previousIndex][thisIndex]++;
		});
		
		return bigram;
	}

}

module.exports = BeingObjectGenerator;
