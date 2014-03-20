/*
	Lightweight CLI to run normalization tests on raw iPhone message data
 */

var Contraction = require('./classes/Contraction.js'),
Normalizer = require('./classes/Normalizer'),
_ = require('underscore'),
fs = require('fs'),
natural = require('natural'),
argv = require('argv');

normalizer = new Normalizer();

var args = argv.option([{
	   
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'Defines the file to use',
	    example: "'script --input=value' or 'script -i value'"
	},{
	    name: 'random',
	    short: 'r',
	    type: 'string',
	    description: 'Grabs random messages from each corpus',
	    example: "'script --random' or 'script -r'"
	}]).run().options;

var contraction = new Contraction();
var startIndex = 0;
var endIndex = 100;

if (!_.isUndefined(args.input) ||
	!_.isUndefined(args.random)) {
	
	if (!_.isUndefined(args.input)) {

		fs.readFile(args.input, function(err, data){

			if (err) throw err;
			var messages = JSON.parse(data);

			for ( var i = startIndex; i <= messages.length; i++) {
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
						fs.readFile(pathToCorpusFolders + file + '/raw_iphone.json', function(err, data){
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

		var normalized = normalizer.normalize(text);
		if (normalized != text) {
			console.log("Original:   " + text);
			console.log("Normalized: " + normalized);
			console.log();
		}
	}
}