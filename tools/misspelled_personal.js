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

var startTime = new Date().getTime();

if (typeof args.input !== 'undefined') {

	fs.readFile(args.input, function (err, data) {

		var messages = JSON.parse(data);
		var misspellings = [];
		var wordsMisspelled = 0;
		var wordsChecked = 0;
		var wordsCorrect = 0;
		var messagesScanned = 0;

		// messages = _.where(messages, {from: "Me"});

		_.each(messages, function(message, i){
			
			var textWords = message.text.split(' ');
			
			textWords = _.map(textWords, function(word){ return word.replace(/[\n.,!?;:"')(*]/g,'') });
			
			messagesScanned++;

			_.each(textWords, function(word, j){
				
				spell.check(word, function(err, correct, suggestions) {
				    
				    if (err) throw err;
				    if (!correct &&
				    	!_.isUndefined(suggestions)) {

				    	var previousOccurenceIndex = undefined;

				    	_.each(misspellings, function(obj, i){
				    		if (obj.word == word) {
				    			previousOccurenceIndex = i;
				    			return;
				    		}
				    	});

				    	if (_.isUndefined(previousOccurenceIndex)){
				    		misspellings.push({
				    			word: word,
				    			frequency: 1
				    		});
				    	} else {
				    		misspellings[previousOccurenceIndex].frequency++;
				    	}
				    	wordsMisspelled++;
				  	} else {
				  		wordsCorrect++;
				  	}

				  	wordsChecked++;

				  	if (i == messages.length - 1 &&
				  		j == textWords.length - 1) {
				  	
				  		var endTime = new Date().getTime();
						var totalTime = endTime - startTime;
						
						console.log("Total Time: " + totalTime + " millis");
				  		console.log("Total Messages: " + messagesScanned);
				  		console.log("Total Words: " + wordsChecked);
				  		console.log("Correct Words: " + wordsCorrect);
				  		console.log("Misspelled Words: " + wordsMisspelled);

				  		_.sortBy(misspellings, function(obj){ return obj.frequency });
				  		_.each(misspellings, function(obj){
				  			if (obj.frequency > 1){
				  				console.log(obj.frequency + ": " + obj.word);
				  			}
				  		});
				  	}
				});
			})
		});
	});
}