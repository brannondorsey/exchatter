var fs = require('fs'),
_ = require('underscore')._,
argv = require('argv');

var args = argv.option([
	{
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'text file',
	    example: "'script --input filename' or 'script -i filename'"
	},
	{
		name: 'output',
	    short: 'o',
	    type: 'string',
	    description: 'JSON file',
	    example: "'script --output filename' or 'script -o filename'"	
	}
]).run().options;

var positiveMouths = [ ")", "]", "p", "P", ">", "D" ];
var negativeMouths = [ "c", "C", "(", "[", "/", "\\", "|", "s", "S", "?" ];

if (typeof args.input !== 'undefined' &&
	typeof args.output !== 'undefined') {
	
	var parentObj = {};

	var array = fs.readFile(args.input, function(err, data){
		
		var emoticons = JSON.parse(data);
		var positive = [];
		var neutral  = [];
		var negative = [];
		
		_.each(emoticons, function(emoticon){
			
			mouth = emoticon.charAt(emoticon.length - 1);
			if (_.indexOf(positiveMouths, mouth) != -1) {
				positive.push(emoticon);
			} else if (_.indexOf(negativeMouths, mouth) != -1) {
				// console.log("got in here tho");
				negative.push(emoticon);
			} else {
				neutral.push(emoticon);
			}
		});


		fs.writeFile(args.output, JSON.stringify([positive, neutral, negative]), function (err) {
		  if (err) throw err;
		  console.log('Saved file to ' + args.output);
		});
	});

} else console.log("Incorrect usage");