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

var args = argv.option([{
	   
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'Defines the file to use',
	    example: "'script --input=value' or 'script -i value'"
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

if (!_.isUndefined(args.input) ||
	!_.isUndefined(args.message) ||
	!_.isUndefined(args.random)) {
	
	if (!_.isUndefined(args.message)) {

		output(message);

	} else if (!_.isUndefined(args.input)) {

		fs.readFile(args.input, function(err, data){

			if (err) throw err;
			var messages = JSON.parse(data);

			for ( var i = startIndex; i <= endIndex; i++) {
				output(messages[i].text);
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
								output(message.text);
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

function output(text) {
	if (!_.isUndefined(text)) {

		// messageObjGenerator.getMessageObject(text, undefined, undefined, function(messageObj){
		// 	console.log(util.inspect(messageObj, {colors: true, depth: 4}));
		// 	console.log();
		// 	console.log();
		// });
		
		wordPOS.getPOS(text, function(result){
			console.log(util.inspect(text, {colors: true, depth: 4}));
			console.log(util.inspect(result, {colors: true, depth: 4}));
			console.log();
		});
		

		
	}
}