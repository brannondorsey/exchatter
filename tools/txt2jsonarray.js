var fs = require('fs'),
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

if (typeof args.input !== 'undefined' &&
	typeof args.output !== 'undefined') {
	
	var array = fs.readFileSync(args.input).toString().split("\n");
	var jsonArray = [];
	for(i in array) {
	    jsonArray.push(array[i].trim());
	}

	fs.writeFile(args.output, JSON.stringify(jsonArray), function (err) {
	  if (err) throw err;
	  console.log('Saved file to ' + args.output);
	});

} else console.log("Incorrect usage");