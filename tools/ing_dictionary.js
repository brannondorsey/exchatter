var fs = require('fs'),
_ = require('underscore')._;

fs.readFile('data/dictionaries/ing.csv', 'utf8', function (err, data) {
	
	var lines = data.split('\n');
	_.each(lines, function(line){

		var slashIndex = line.indexOf('/');
		
		if (slashIndex != -1) {
			console.log(line.substring(0, slashIndex - 1));
		} else {
			console.log(line);
		}

	});
});
