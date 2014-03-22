var Contraction = require('./classes/Contraction.js'),
PatternHelper = require('./classes/PatternHelper.js'),
Normalizer = require('./classes/Normalizer'),
MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
Helpers = require('./classes/Helpers'),
WordPOS = require('wordpos'),
_ = require('underscore'),
moment = require('moment'),
fs = require('fs'),
util = require('util'),
natural = require('natural'),
argv = require('argv');

var messageObjGenerator = new MessageObjectGenerator();
var patternHelper = new PatternHelper();
var normalizer = new Normalizer();
var tokenizer = new natural.WordTokenizer();
var wordPOS = new WordPOS();
var helpers = new Helpers();

var args = argv.option({
	   
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'Defines the file to use',
	    example: "'script --input=value' or 'script -i value'"
	}).run().options;

if (!_.isUndefined(args.input)) {

	fs.readFile(args.input, function(err, data){

		if (err) throw err;
		var people = JSON.parse(data);
		people = _.sortBy(people, function(person) { return - person.messages.length; });


		var messagesByDiff = [];
		var diffs = [];
		
		_.each(people, function(person){
			var previousMessage;
			_.each(person.messages, function(message){
	 			
		 		if (!_.isUndefined(previousMessage)) {
		 			var lastTime = moment(previousMessage.timestamp);
		 			var thisTime = moment(message.timestamp);
		 			var diff = thisTime.diff(lastTime, 'minutes', true);
		 			diffs.push(helpers.round(diff, 1));
		 			messagesByDiff.push({
		 				diff: diff,
		 				previousMessage: previousMessage,
		 				message: message
		 			});
		 		}
		 		
		 		previousMessage = message;
		 	});
	 	});

	 	var graphData = [];
	 	var uniq = _.uniq(diffs);
		_.each(uniq, function(num){
			if (num <= 60) graphData.push([num, _.filter(diffs, function(n){ return n == num }).length]);
		});

		graphData = _.sortBy(graphData, function(array){ return array[0] });


		console.log("var graphData = ");
		console.log(graphData)
		console.log(";");
	 	// messagesByDiff = _.sortBy(messagesByDiff, function(obj){ return - obj.diff });
	});

} else {

	console.log('Please include an --input or -i value');
	process.exit();
}

function output(message) {

	console.log("Timestamp: " + message.timestamp);
	console.log("Original: " + message.text);
	console.log("Normalized: " + message.normalized.text);
	console.log();
}