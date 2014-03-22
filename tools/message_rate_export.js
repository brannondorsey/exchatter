/*
	Groups an iPhone corpus that has __aready__ been parsed into Message Objects
	by phone numbers like this:
	[{
		number: "##########",
		messages: [{}]
	}]
 */

var MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
_ = require('underscore'),
moment = require('moment'),
fs = require('fs'),
util = require('util'),
argv = require('argv');

var messageObjGenerator = new MessageObjectGenerator();

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
	    description: 'Defines the file to save',
	    example: "'script --output=value' or 'script -o value'"
	}]).run().options;

if (!_.isUndefined(args.input) &&
	!_.isUndefined(args.output)) {

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

		var sum = _.reduce(people, function(memo, person){
			return person.messages.length;
		})

		console.log(sum);

		// fs.writeFile(args.output, JSON.stringify(people), function(err){
		// 	if (err) throw err; 
		// 	console.log("Saved file to " + args.output);

		// });
	});

} else argv.help();
