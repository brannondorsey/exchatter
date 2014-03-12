var fs = require('fs'),
_ = require('underscore')._,
argv = require('argv');

var args = argv.option([
	{
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'JSON file',
	    example: "'script --input filename' or 'script -i filename'"
	}
]).run().options;


if (typeof args.input !== 'undefined') {

	fs.readFile('data/dictionaries/casual_misspellings.csv', 'utf8', function (err, data) {
		
		if (err) throw err;

		var casualMisspellings = _.map(data.split('\n'), function(line){
			return line.substring(0, line.indexOf(',')).trim().toLowerCase();
		});

		fs.readFile('data/dictionaries/text_acronyms.csv', 'utf8', function (err, data) {

			if (err) throw err;

			var textAcronyms = _.map(data.split('\n'), function(line){
				return line.substring(0, line.indexOf(',')).trim().toLowerCase();
			});

			fs.readFile('data/dictionaries/contractions.csv', 'utf8', function (err, data) {
				
				var contractionMisspellings = [];

				_.each(data.split('\n'), function(line){
					
					var misspellingsPos = line.lastIndexOf(',') + 1;
					
					if (misspellingsPos != -1) {
						
						var misspellingString = line.substring(misspellingsPos);
						_.each(misspellingString.split(';'), function(misspelling){
							
							if (misspelling != '') {
								contractionMisspellings.push(misspelling.trim());
								// console.log(misspelling);
							}
						});
					}
					
				});

				var dictionary = casualMisspellings.concat(textAcronyms, contractionMisspellings);
		
				fs.readFile(args.input, 'utf8', function (err, data) {

					if (err) throw err;

					var numExcluded = 0;

					_.each(data.split('\n'), function(line){
						
						var colonPos = line.indexOf(':');
						if (colonPos != -1) {

							var numUsed = line.slice(0, colonPos).trim();
							var word = line.slice(colonPos + 1).trim();
							
							if (dictionary.indexOf(word.toLowerCase()) == -1) {
							   console.log(numUsed + ": " + word);
							} else {
								// console.log(word + " is already in the slang dictionary.");
								numExcluded++;
							}
						}
					});

					console.log("Number of excluded words: " + numExcluded);
				
				});

			});
		});
	});
}