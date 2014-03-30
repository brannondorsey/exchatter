/*
	Generates an array of Message Objects from a raw iPhone
	message corpus.
 */

var MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
_ = require('underscore'),
fs = require('fs'),
util = require('util'),
argv = require('argv');

var messageObjGenerator = new MessageObjectGenerator();

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
	}]).run().options;

var startIndex = 550;
var endIndex = 600;

if (!_.isUndefined(args.input) &&
	!_.isUndefined(args.output)) {
	
	if (!_.isUndefined(args.input)) {

		fs.readFile(args.input, function(err, data){

			if (err) throw err;
			var messages = JSON.parse(data);

			for ( var i = startIndex; i <= messages.length; i++) {
				output(messages[i], i, messages.length);
			}
		});

	}

} else argv.help();

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
				  console.log('File saved to ' + args.output);
				});
			}
		});
	}
}