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
	    description: 'JSON file',
	    example: "'script --input filename' or 'script -i filename'"
	}
]).run().options;

if (typeof args.input !== 'undefined') {

	fs.readFile(args.input, function (err, data) {

		var messages = JSON.parse(data);
		var misspellings = {};

		messages = _.where(messages, {from: "Me"});

		_.each(messages, function(message, i){
			
			var textWords = message.text.split(' ');
			
			textWords = _.map(textWords, function(word){ return word.replace(/[\n.,!?;:"')(*]/g,'') });
			
			var numChecked = 0;
			var correctedWords = [];

			_.each(textWords, function(word, j){
				
				spell.check(word, function(err, correct, suggestions) {
				    
				    if (err) throw err;
				    if (!correct &&
				    	!_.isUndefined(suggestions)) {
				    	if (misspellings.hasOwnProperty(word)){
				    		misspellings[word]++;
				    	} else {
				    		misspellings[word] = 1;
				    	}
				  	}

				  	if (i == messages.length - 1 &&
				  		j == textWords.length - 1) {
				  	
				  		var temp = [];
				  		_.each(misspellings, function(value, property){
				  			console.log(value + ": " + property);
				  		});
				  		
				  		// console.log(temp.length);
				  		// var sorted = _.sortBy(temp, function(key, value){ 
				  		// 	console.log(key);
				  		// });
				  		// console.log(sorted);
				  	}
				});
			})
		});
	});
}