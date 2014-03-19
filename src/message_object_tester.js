var Contraction = require('./classes/Contraction.js'),
PatternHelper = require('./classes/PatternHelper.js'),
Normalizer = require('./classes/Normalizer'),
MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
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
		var messageObjs = JSON.parse(data);
		var previousMessageObj;
		var numbers = [];
		var messagesByNumber = [];

		messageObjs = _.sortBy(messageObjs, function(obj){ return moment(obj.timestamp).valueOf() });
		
		_.each(messageObjs, function(messageObj){
			if (numbers.indexOf(messageObj.to) == -1 && messageObj.to != "Me") numbers.push(messageObj.to);
			if (numbers.indexOf(messageObj.from) == -1 && messageObj.from != "Me") numbers.push(messageObj.from);
		});

		_.each(messageObjs, function(messageObj){
			var toIndex = numbers.indexOf(messageObj.to);
			var fromIndex = numbers.indexOf(messageObj.to);
			if (toIndex != -1) {
				if (_.isUndefined(messagesByNumber[toIndex])) messagesByNumber[toIndex] = [];
				messagesByNumber[toIndex].push(messageObj);
			} else if (fromIndex != -1) {
				if (_.isUndefined(messagesByNumber[fromIndex])) messagesByNumber[fromIndex] = [];
				messagesByNumber[fromIndex].push(messageObj);
			}
		});
		
		var people = [];
		
		_.each(messagesByNumber, function(message, i){
			people.push({
				number: numbers[i],
				messages: messagesByNumber[i]
			});
		});

		people = _.sortBy(people, function(person){
			return person.messages.length;
		});

		// _.each(people, function(person){
		// 	console.log("Number: " + person.number);
		// 	console.log("Messages: " + person.messages.length);
		// 	console.log();
		// });

		console.log(JSON.stringify(people));

		// _.each(persons, function(person){
			
		// });

	 	// _.each(messageObjs, function(messageObj){
	 	// 	if (!_.isUndefined(previousMessageObj)) {
	 	// 		var lastTime = moment(previousMessageObj.timestamp);
	 	// 		var thisTime = moment(messageObj.timestamp);
	 	// 		var diff = thisTime.diff(lastTime, 'seconds', true);
	 	// 	}
	 	// 	// output(messageObj);
	 	// 	previousMessageObj = messageObj
	 	// });
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