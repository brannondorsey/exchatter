var fs = require('fs'),
_ = require('underscore')._,
SpellCheck = require('spellcheck'),
spell = new SpellCheck( 'data/dictionaries/en_US.aff', 'data/dictionaries/en_US.dic');

var startTime = new Date().getTime();

fs.readFile("data/pan-12/pan12-sexual-predator-identification-training-corpus-2012-05-01.json", function (err, data) {

	if (err) throw err;
	var conversations = JSON.parse(data).conversations.conversation;
	var misspellings = [];

	var messagesToCheck = 900000;
	var wordsToCheck = 0; // increment this real time
	var messagesScanned = 0;
	var wordsChecked = 0;
	var wordsCorrect = 0;
	var wordsMisspelled = 0;
	// var totalMessages = 0;

	_.each(conversations, function(conversation, i){
		
		var shouldReturn = false;

		_.each(conversation.message, function(message, j){
			
			// totalMessages++;
			if (messagesScanned >= messagesToCheck){
				shouldReturn = true;
				return;
			}

			if (!_.isUndefined(message.text)) {
				
				messagesScanned++;

				var textWords = message.text.split(' ');
		
				textWords = _.map(textWords, function(word){ return word.replace(/[.,!?;:)(]/g,'') });
				
				if (textWords.length < 100) {

					wordsToCheck += textWords.length;

					_.each(textWords, function(word, j){
						
						if (word.length < 15) {
							
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
							  	}

							  	if (correct) wordsCorrect++;

							  	wordsChecked++;

								if (wordsChecked >= wordsToCheck){
									
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
							  		
							  		process.exit(0);
							  	}
							});
						} else {
							wordsToCheck--;
						}
					});
				}
			}
		});

		if (shouldReturn) return;
	});
	// console.log(totalMessages);
	console.log("Scanned " + messagesToCheck + " Messages");
});
