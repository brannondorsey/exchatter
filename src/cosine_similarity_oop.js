var CosineSimilarity = require('./CosineSimilarity.js'),
argv = require('argv'),
fs = require('fs');

var args = argv.option({

    name: 'message',
    short: 'm',
    type: 'string',
    description: 'Defines the message to query',
    example: "'script --message=value' or 'script -m value'"

}).run().options;

if (typeof args.message !== 'undefined') {

	var input = args.message;

	fs.readFile('data/all_combined.json', function(err, data){
		

		if (err) throw err;
		var corpus = JSON.parse(data);
	
		var cosignSimilarity = new CosineSimilarity(corpus);
		var scoredCorpus = cosignSimilarity.findSimilar(input, {
			include: {
				from: ["8049215907", "Me"]
			},
			neglect: {
				from: "Me"
			},
			limit: 100
		});
		console.log(scoredCorpus.length);
		var numbPrint = 5;
		for(var i = 0; i < numbPrint; i++){
			console.log(scoredCorpus[i].text  + ' | from: ' + scoredCorpus[i].from + ' | score: ' + scoredCorpus[i].score);
		}
		
		//console.log(scoredCorpus[0].text + ' | score: ' + scoredCorpus[0].score);
	});
} else {

	console.log('Please include a --message or -m value');
	process.exit();
}
