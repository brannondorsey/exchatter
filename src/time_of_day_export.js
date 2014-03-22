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
		var messages = JSON.parse(data);

	 	_.each(messages, function(message){

	 		// normalize to same day
	 		message.timestamp = new Date("2009/01/01 " +/ \d\d:\d\d/ig.exec(message.timestamp)[0].trim() + ":00");
	 		var coeff = 1000 * 60 * 10; // round to nearest 10 minutes
			message.timestamp = moment(new Date(Math.round(message.timestamp.getTime() / coeff) * coeff)).format("YYYY/MM/DD HH:mm:ss");
	 	})

	 	messages = _.sortBy(messages, function(message) { return message.timestamp });
	 	var timeOfDayData = [];
	 	var times = _.pluck(messages, "timestamp");

	 	var uniq = _.uniq(times);
		_.each(uniq, function(time){
			timeOfDayData.push([time, _.filter(times, function(n){ return n == time }).length]);
		});
		
		console.log("var timeOfDayData = ");
		console.log(timeOfDayData)
		console.log(";");
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