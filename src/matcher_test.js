var SimilarityMatcher = require('./classes/SimilarityMatcher'),
MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
PersonalCorpus = require('./classes/PersonalCorpus'),
_ = require('underscore')._,
moment = require('moment');

var messageObjGenerator = new MessageObjectGenerator();
var similarityMatcher = new SimilarityMatcher();
var personalCorpus = new PersonalCorpus('data/corpuses/brannon_dorsey/corpus.json', function(corpus){

	var message = 'Hey, what are you doin later?';
	messageObjGenerator.getMessageObject({
		source: "string",
		to: "string",
		from: "string",
		timestamp: "string",
		text: message
	}, function(messageObj){

		var similarResults = similarityMatcher.getSimilar(messageObj, "Me", personalCorpus);

		_.each(similarResults, function(similar){

			var response = similarityMatcher.getNearestResponse(similar.message, personalCorpus);
			if (response) {

				console.log("Similarity: " + similar.score);
				console.log("from: " + similar.message.from);
				console.log("to: " + similar.message.to);
				console.log(similar.message.timestamp);
				console.log("text: " + similar.message.text);
				console.log();
				console.log(response.from);
				console.log(response.timestamp);
				console.log(response.text);
				console.log();
			}	
		});
	});
});
