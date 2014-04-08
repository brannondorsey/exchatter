/*
	New test that does a neighbor match to
	match an input with a similar message and output the next
	message from the corpus to the console. This test uses 
	the Message object and runs similarity on normalized text.
	No text generation is done at this point.
 */

var SimilarityMatcher = require('./classes/SimilarityMatcher'),
MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
PersonalCorpus = require('./classes/PersonalCorpus'),
_ = require('underscore'),
argv = require('argv'),
readline = require('readline'),
fs = require('fs');


var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var args = argv.option([{
	   
	    name: 'person',
	    short: 'p',
	    type: 'string',
	    description: 'Defines the corpus folder to use in "data/corpuses/" to use',
	    example: "'script --person=value' or 'script -p value'"
	}]).run().options;

var messageObjGenerator = new MessageObjectGenerator();
var similarityMatcher = new SimilarityMatcher();
var personalCorpus;

if (!_.isUndefined(args.person)) {
	
	personalCorpus = new PersonalCorpus('data/corpuses/' + args.person + '/corpus.json', function(corpus){

		//say hi!
		respond("Hi!\n");
	});
} else {
	argv.help();
	process.exit(0);
}

//------------------------------------------------------------------

function respond(response) {
	rl.question(response, function(input){

	// var message = 'Hey, what are you doin later?';
		messageObjGenerator.getMessageObject({
			source: "string",
			to: "string",
			from: "string",
			timestamp: "string",
			text: input
		}, function(messageObj){

			var response = "NO SIMILAR MESSAGE FOUND";
			var similarResults = similarityMatcher.getSimilar(messageObj, "Me", personalCorpus);
			if (similarResults.length > 0) {
				var similar = _.sample(similarResults);
				var response = similarityMatcher.getNearestResponse(similar.message, personalCorpus);
				if (response) response = response.text;
			}
			
			respond(response + '\n');
		});
	});
}