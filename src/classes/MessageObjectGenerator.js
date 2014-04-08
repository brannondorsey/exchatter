var _ = require('underscore')._,
_natural = require('natural'),
_phone = require('phone'),
Helpers = require('./Helpers'),
PatternHelper = require('./PatternHelper'),
Normalizer = require('./Normalizer'),
SMSSentiment = require('./SMSSentiment');

var _helpers = new Helpers();
var _patternHelper = new PatternHelper();
var _normalizer = new Normalizer();
var _smsSentiment = new SMSSentiment();
var _tokenizer = new _natural.WordTokenizer();

function MessageObjectGenerator() {
	
}

/* {
	source: "string",
	to: "string",
	from: "string",
	timestamp: "string",
	text: "string"	
} */
MessageObjectGenerator.prototype.getMessageObject = function(config, callback) {
	
	var messageObj = {};
	var text = config.text;
	var source = config.source;
	var from = config.from;
	var to = config.to;
	var timestamp = config.timestamp;

	messageObj.id = _helpers.generateID(40);
	messageObj.timestamp = timestamp;
	messageObj.from = _phone(from, '') || from;
	messageObj.to = _phone(to, '') || to;
	messageObj.source = source;
	messageObj.text = text;
	messageObj.sentences = _getSentenceObjects(text);
	// messageObj.misspellings = [];
	// _.each(messageObj.sentences, function(sentence){ 
	// 	messageObj.misspellings = messageObj.misspellings.concat(sentence.misspellings) 
	// });
	// messageObj.topics = _getTopics(text);
	messageObj.normalized = {};
	messageObj.normalized.text = _normalizer.normalize(text);
	messageObj.normalized.sentences = _getSentenceObjects(messageObj.normalized.text);
	messageObj.hasQuestion = _patternHelper.hasQuestion(text);
	messageObj.isQuestion = (messageObj.sentences.length == 1 && messageObj.hasQuestion);
	messageObj.hasExclamatory = _patternHelper.hasExclamatory(text);
	messageObj.isExclamatory = (messageObj.sentences.length == 1 && messageObj.hasExclamatory);
	_smsSentiment.getSentiment(messageObj.normalized.text, function(err, result){
		if (err) throw err;
		messageObj.sentiment = result;
		callback(messageObj);
	});
}

function _getSentenceObjects(string) {
	var sentenceObj = [];
	var sentences = _patternHelper.getSentences(string);
	_.each(sentences, function(sentence){
		var words = _tokenizer.tokenize(sentence);
		sentenceObj.push({
			sentence: sentence,
			words: words,
			isQuestion: _patternHelper.isQuestion(sentence),
			isExclamatory: _patternHelper.isExclamatory(sentence),
			// subjects: _getSubjects(sentence),
			// wordPOS: _getWordPOS(sentence),
			misspellings: _getMisspellingObjects(words),
			stopWords: _normalizer.getStopWords(sentence)
		});
	});
	return sentenceObj;
}

function _getTopics(string) {

}

function _getSubjects(string) {

}

function _getWordPOS(string) {

}

function _getMisspellingObjects(words) {
	var slangMisspellings = [];
	_.each(words, function(word){

		var threeOrMoreOfTheSameChar = false;
		var lookup;
		var lessLetters = _patternHelper.replaceThreeOrMoreOfTheSameChars(word);

		if (word != lessLetters) {
			threeOrMoreOfTheSameChar = true;
			lookup = _normalizer.slangLookup(word);
		} else lookup = _normalizer.slangLookup(word);
		
		if (lookup) {
			slangMisspellings.push({
				word: lookup,
				misspelling: word,
				confirmed: true
			});
		} else if (threeOrMoreOfTheSameChar) {
			slangMisspellings.push({
				word: lessLetters,
				misspelling: word,
				confirmed: false
			});
		}
	});
	return slangMisspellings;
}

module.exports = MessageObjectGenerator;