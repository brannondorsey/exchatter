var Contraction = require('./classes/Contraction.js'),
PatternHelper = require('./classes/PatternHelper.js'),
Normalizer = require('./classes/Normalizer'),
_ = require('underscore'),
fs = require('fs'),
natural = require('natural'),
argv = require('argv');

patternHelper = new PatternHelper();
normalizer = new Normalizer();

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
var startIndex = 500;
var endIndex = 1000;

if (!_.isUndefined(args.input) ||
	!_.isUndefined(args.message)) {
	
	if (!_.isUndefined(args.message)) {

		var normalized = normalizer.normalize(message.text);
		console.log("Original:   " + args.message);
		console.log("Normalized: " + normalized);
		console.log();

	} else if (!_.isUndefined(args.input)) {

		fs.readFile(args.input, function(err, data){

			if (err) throw err;
			var messages = JSON.parse(data);

			
			for ( var i = startIndex; i <= endIndex; i++) {

				var message = messages[i];

				// var normalized = normalizer.normalize(message.text);
				var normalized = normalizer.normalize(message.text);
				if (message.text != normalized) {
				
					console.log("Original:   " + message.text);
					console.log("Normalized: " + normalized);
					console.log();
					
				}	
			}
		});
	}

} else {

	console.log('Please include an --input or -i value');
	process.exit();
}