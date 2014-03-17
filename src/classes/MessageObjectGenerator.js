var _ = require('underscore')._,
_sentiment = require('sentiment'),
Helpers = require('./Helpers'),
PatternHelper = require('./PatternHelper'),
Normalizer = require('./Normalizer'),
SMSSentiment = require('./SMSSentiment');

var _helpers = new Helpers();
var _patternHelper = new PatternHelper();
var _normalizer = new Normalizer();
var _smsSentiment = new SMSSentiment();

function MessageObjectGenerator() {
	
}

MessageObjectGenerator.prototype.getMessageObject = function(text, sender, source, callback) {
	
	var messageObj = {};
	messageObj.id = _helpers.generateID(40);
	messageObj.text = text;
	messageObj.sender = sender;
	messageObj.source = source;
	messageObj.sentences = _getSentenceObjects(text);
	messageObj.topics = _getTopics(text);
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
		var words = _getWords(sentence);
		sentenceObj.push({
			sentence: sentence,
			words: words,
			isQuestion: _patternHelper.isQuestion(sentence),
			isExclamatory: _patternHelper.isExclamatory(sentence),
			subjects: _getSubjects(sentence),
			wordOrder: _getWordOrder(sentence),
			misspellings: _getMisspellingObjects(words),
			stopWords: _normalizer.getStopWords(sentence)
		});
	});
	return sentenceObj;
}

function _getWords (sentence) {
	var words = [];
	_patternHelper.eachWord(sentence, function(word){
		words.push(word);
	});
	return words;
}

function _getTopics(string) {

}

function _getSubjects(string) {

}

function _getWordOrder(string) {

}

function _getMisspellingObjects(string) {

}

module.exports = MessageObjectGenerator;