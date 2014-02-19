var CosineSimilarity = require('./CosineSimilarity.js'),
argv = require('argv'),
fs = require('fs');

var args = argv.option([
	{
	    name: 'message',
	    short: 'm',
	    type: 'string',
	    description: 'Defines the message to query',
	    example: "'script --message=value' or 'script -m value'"
	},
	{
		name: 'ex',
	    short: 'x',
	    type: 'string',
	    description: 'Defines the phone number of the ex',
	    example: "'script --ex=value' or 'script -x value'"	
	}
]).run().options;

if (typeof args.message !== 'undefined' &&
	typeof args.ex !== 'undefined') {

	var input = args.message;
	var exPhoneNumber = args.ex;

	fs.readFile('data/corpuses/brannon_dorsey/all.json', function(err, data){
		

		if (err) throw err;
		var corpus = JSON.parse(data);

		var instructions = {
			limit: 5,
			minScore: .4
		}
	
		var cosignSimilarity = new CosineSimilarity(corpus);
		var scoredCorpus = cosignSimilarity.findSimilar(input, instructions);

		//print prompt
		console.log();
		console.log('##"' + args.message + '"');

		//print the cosineSimilarity instructions
		console.log("instructions`")
		console.log(instructions);
		console.log('`');
		console.log();

		// for(var i = 0; i < scoredCorpus.length; i++){
		// 	console.log('score: ' + scoredCorpus[i].score);
		// 	console.log('date: ' + scoredCorpus[i].date);
		// 	console.log('to: ' + scoredCorpus[i].to);
		// 	console.log('from: ' + scoredCorpus[i].from);
		// 	console.log('message: ' + scoredCorpus[i].text);
		// 	console.log();
		// }
		
		if (scoredCorpus.length == 0) prompt = "###NO RESULTS FOUND";
	  	else {

	  		//holds 
	  		var foundResponses = [];

	  		//loop through all similar messages
	  		for(var similar in scoredCorpus){

		  		var similar = scoredCorpus[similar]
		  		var similarIndex;

		  		//find the message's index in the original corpus
		  		for(var i in corpus){
		  			if(similar.from == corpus[i].from &&
		  			   similar.text == corpus[i].text) {
		  				similarIndex = i;
		  				break;
		  			} 
		  		}

		  		var response;

		  		// loop through all messages starting at the most similar message
			  	for (var i = similarIndex; i < corpus.length; i++) {
			  		
			  		//find the next message between the two participants
			  		if (corpus[similarIndex].to == corpus[i].from &&
			  		   corpus[similarIndex].from == corpus[i].to){
			  		   	response = corpus[i];
			  			break;

			  		}
			  	}

			  	if (response) {

			  		if (foundResponses.indexOf(response.text) == -1) {

				  		console.log('###"' + response.text + '"');
				  		console.log();
				  		console.log('```');
				  		console.log('Score: ' + similar.score);
				  		console.log('RE: "' + similar.text + '" @ ' + similar.date);
				  		console.log('Reply: "' + response.text + '" @ ' + response.date);
				  		console.log('From ex: ' + (similar.from == exPhoneNumber).toString());
				  		console.log('```');
				  		console.log();
			  		}

			  		foundResponses.push(response.text);
			  	
			  	} else { // the person never responded
			  		console.log('THIS PERSON NEVER RESPONDED');
			  	}
		  	}
		}
	});

} else {

	console.log('Please include a --message or -m value AND an --ex or -x value');
	process.exit();
}
