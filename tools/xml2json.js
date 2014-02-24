var argv = require('argv'),
xml2js = require('xml2js'),
fs = require('fs');

var args = argv.option([
	{
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'XML file',
	    example: "'xml2Json.js --input filename' or 'script -i filename'"
	},
	{
		name: 'output',
	    short: 'o',
	    type: 'string',
	    description: 'JSON file',
	    example: "'xml2Json.js --output filename' or 'script -o filename'"	
	}
]).run().options;

if (typeof args.input !== 'undefined' &&
	typeof args.output !== 'undefined') {

	var parser = new xml2js.Parser({
		ignoreAttrs: true,
		explicitArray: false
	});
	
	parser.addListener('end', function(result) {
	    var json = JSON.stringify(result);
	    // console.dir(result);
	    fs.writeFile(args.output, json, function (err) {
		  if (err) throw err;
		  console.log('Saved file to ' + args.output);
		});
	});

	fs.readFile(args.input, "utf-8", function(err, data) {

		if (err) throw err;
		var dataString = data;
		//console.log(dataString);
		parser.parseString(dataString);
	});

} else argv.help();
