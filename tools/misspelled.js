var fs = require('fs'),
_ = require('underscore')._,
SpellCheck = require('spellcheck'),
spell = new SpellCheck( 'data/dictionaries/en_US.aff', 'data/dictionaries/en_US.dic');

fs.readFile("data/pan-12/pan12-sexual-predator-identification-training-corpus-2012-05-01.json", function (err, data) {

	if (err) throw err;
	var conversations = JSON.parse(data).conversations.conversation;
	var misspelledWords = [];

	_.each(conversations, function(conversation, i){
		_.each(conversation.message, function(message, j){

			if (!_.isUndefined(message.text)) {
				
				// console.log(message.text);

				var textWords = message.text.split(' ');
		
				textWords = _.map(textWords, function(word){ return word.replace(/[.,!?;:]/g,'') });

				_.each(textWords, function(word){
					
					spell.check(word, function(err, correct, suggestions) {
					    
					    if (err) throw err;
					    if (!correct &&
					    	misspelledWords.indexOf(word) == -1){
					    	console.log(word);
					    	misspelledWords.push(word);
					    }
					    
					});
				})
			}
		});
	});
});
