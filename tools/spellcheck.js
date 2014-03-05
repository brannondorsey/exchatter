var fs = require('fs'),
_ = require('underscore')._,
argv = require('argv'),
SpellCheck = require('spellcheck'),
spell = new SpellCheck( 'data/dictionaries/en_US.aff', 'data/dictionaries/en_US.dic');;

var args = argv.option([
	{
	    name: 'input',
	    short: 'i',
	    type: 'string',
	    description: 'XML file',
	    example: "'xml2Json.js --input filename' or 'script -i filename'"
	}
]).run().options;

if (typeof args.input !== 'undefined') {

	fs.readFile(args.input, function (err, data) {

		var messages = JSON.parse(data);
		_.each(messages, function(message){
			
			var textWords = message.text.split(' ');
			
			textWords = _.map(textWords, function(word){ return word.replace(/[.,!?;:]/g,'') });
			
			var numChecked = 0;
			var correctedWords = [];

			_.each(textWords, function(word){
				
				spell.check(word, function(err, correct, suggestions) {
				    
					numChecked++;
				    if (err) throw err;
				    if (!correct &&
				    	!_.isUndefined(suggestions)) {
				    	word = suggestions[0];
				  	}

				  	correctedWords.push(word);

				  	if (numChecked == textWords.length) {
				  		
				  		console.log("Original: " + message.text);
				  		console.log("Spell fixed: " + correctedWords.join(' '));
				  		console.log();
				  	}
				  	
				});
			})
		});
	});
}