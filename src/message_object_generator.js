var Contraction = require('./classes/Contraction.js'),
PatternHelper = require('./classes/PatternHelper.js'),
Normalizer = require('./classes/Normalizer'),
MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
WordPOS = require('wordpos'),
_ = require('underscore'),
fs = require('fs'),
util = require('util'),
natural = require('natural'),
argv = require('argv');

var messageObjGenerator = new MessageObjectGenerator();
var patternHelper = new PatternHelper();
var normalizer = new Normalizer();
var tokenizer = new natural.WordTokenizer();
var wordPOS = new WordPOS();

var messageObjs = [];
var count = 0;

var args = argv.option([{
	   
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'Defines the file to use',
	    example: "'script --input=value' or 'script -i value'"
	},{
	   
	    name: 'output',
	    short: 'o',
	    type: 'string',
	    description: 'Defines the file to export to',
	    example: "'script --output=value' or 'script -o value'"
	},{
	    name: 'message',
	    short: 'm',
	    type: 'string',
	    description: 'Defines the message to use',
	    example: "'script --message=value' or 'script -m value'"
	},{
	    name: 'random',
	    short: 'r',
	    type: 'string',
	    description: 'Grabs random messages from each corpus',
	    example: "'script --random' or 'script -r'"
	}]).run().options;

var contraction = new Contraction();
var startIndex = 550;
var endIndex = 600;

if (!_.isUndefined(args.input) &&
	!_.isUndefined(args.output)||
	!_.isUndefined(args.message) ||
	!_.isUndefined(args.random)) {
	
	if (!_.isUndefined(args.message)) {

		output(message);

	} else if (!_.isUndefined(args.input)) {

		fs.readFile(args.input, function(err, data){

			if (err) throw err;
			var messages = JSON.parse(data);

			for ( var i = startIndex; i <= messages.length; i++) {
				output(messages[i], i, messages.length);
			}
		});

	} else if (!_.isUndefined(args.random)) {
		var pathToCorpusFolders = 'data/corpuses/';
		fs.readdir(pathToCorpusFolders, function(err, files) {
			_.each(files, function(file){
				fs.stat(pathToCorpusFolders + file, function(err, stats){
					if (err) throw err;
					if (stats.isDirectory()) {
						fs.readFile(pathToCorpusFolders + file + '/all.json', function(err, data){
							if (err) throw err;
							var messages = JSON.parse(data);
							var numbFromEachPerson = 30;
							var sample = _.sample(messages, numbFromEachPerson);
							_.each(sample, function(message){
								output(message);
							});
						});
					}
				});
			});
		});
	}

} else {

	console.log('Please include an --input or -i value');
	process.exit();
}

function output(message, i, max) {

	if (!_.isUndefined(message)) {

		var config = {

			source: "personal",
			to: message.to,
			from: message.from,
			timestamp: message.date,
			text: message.text	
		}

		messageObjGenerator.getMessageObject(config, function(messageObj){
			
			messageObjs.push(messageObj);

			if (i == max - 1) {
				
				fs.writeFile(args.output, JSON.stringify(messageObjs), function (err) {
				  if (err) throw err;
				  console.log('Files saved to ' + args.output);
				});
			}
		});
	}
}