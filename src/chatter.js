var CosineSimilarity = require('./CosineSimilarity.js'),
readline = require('readline');
fs = require('fs');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var cosineSimilarity, corpus, scoredCorpus;

fs.readFile('data/all_combined.json', function(err, data){

	if (err) throw err;

	corpus = JSON.parse(data);
	cosineSimilarity = new CosineSimilarity(corpus);

	//say hi!
	respond("Hi there!\n");
});

//------------------------------------------------------------------

function respond(response) {

	rl.question(response , function(input) {
	 	
	 	// get most similar texts
	  	scoredCorpus = cosineSimilarity.findSimilar(input, {
	  		scoreOnly: [{
	  			to: "Me"
	  		}],
			limit: 5,
			minScore: .65,
		});

	  	var prompt;

	  	if (scoredCorpus.length == 0) prompt = "NO RESULTS FOUND";
	  	else {

	  		var mostSimilar = scoredCorpus[0];
	  		var mostSimilarIndex;
	  		for(var i in corpus){
	  			if(mostSimilar.from == corpus[i].from &&
	  			   mostSimilar.text == corpus[i].text) {
	  				mostSimilarIndex = i;
	  				break;
	  			} 
	  		}

	  		// loop through all messages starting at the most similar message
		  	for (var i = mostSimilarIndex; i < corpus.length; i++) {
		  		
		  		if (corpus[mostSimilarIndex].to == corpus[i].from &&
		  		   corpus[mostSimilarIndex].from == corpus[i].to){
		  			prompt = corpus[i].text + ' (re: ' + mostSimilar.text + ')';
		  			break;
		  		}
		  	}
	  	}

		respond(prompt + '\n');
	});
}