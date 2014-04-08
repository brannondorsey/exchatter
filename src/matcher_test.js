var SimilarityMatcher = require('./classes/SimilarityMatcher'),
MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
PersonalCorpus = require('./classes/PersonalCorpus'),
moment = require('moment');

var messageObjGenerator = new MessageObjectGenerator();
var similarityMatcher = new SimilarityMatcher();
var personalCorpus = new PersonalCorpus('data/corpuses/brannon_dorsey/corpus.json', function(corpus){

	var message = 'I want you';
	messageObjGenerator.getMessageObject({
		source: "string",
		to: "string",
		from: "string",
		timestamp: "string",
		text: message
	}, function(messageObj){

	var similar = similarityMatcher.getSimilar(messageObj, personalCorpus);
	var mostSimilar = _.find(personalCorpus.messages, function(message){
		return message.id == similar[0].message.id;
	});

