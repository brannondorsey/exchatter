/*
	Script for testing the contraction module
 */

var Contraction = require('./classes/Contraction.js'),
PatternHelper = require('./classes/PatternHelper.js'),
patternHelper = new PatternHelper(),
Normalizer = require('./classes/Normalizer'),
_ = require('underscore'),
fs = require('fs'),
argv = require('argv');

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
	}]).run().options;

var contraction = new Contraction();
var startIndex = 0;
var endIndex = 100;

if (!_.isUndefined(args.input) ||
	!_.isUndefined(args.message)) {
	
	if (!_.isUndefined(args.message)) {

		console.log("Original:    " + args.message);
		console.log("Contraction: " + contraction.contract(args.message));
		console.log("Expansion:   " + contraction.expand(args.message));
		console.log();

	} else if (!_.isUndefined(args.input)) {

		fs.readFile(args.input, function(err, data){

			if (err) throw err;
			var messages = JSON.parse(data);

			// console.log(messages[100].text);
			// console.log(patternHelper.normalizeOnomatos(messages[100].text));

			for ( var i = startIndex; i <= endIndex; i++) {

				var message = messages[i];

				var normalizedOnomatos = patternHelper.normalizeOnomatos(message.text);
				if (message.text != normalizedOnomatos) {
					console.log(message.text.length);
					console.log(normalizedOnomatos.length);
					console.log("Original:            " + message.text);
					console.log("Normalized Onomatos: " + normalizedOnomatos);
					console.log();
				}
				
				// console.log("Contraction: " + contraction.contract(message.text));
				// console.log("Expansion:   " + contraction.expand(message.text));
				// console.log();

			}
		});
	}

} else {

	console.log('Please include an --input or -i value');
	process.exit();
}