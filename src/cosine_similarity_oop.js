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

	fs.readFile('data/corpuses/brannon_dorsey/all.json', function(err, data){
		

		if (err) throw err;
		var corpus = JSON.parse(data);
	
		var cosignSimilarity = new CosineSimilarity(corpus);
		var scoredCorpus = cosignSimilarity.findSimilar(input, {
			limit: 10,
			minScore: .4
		});
		
		for(var i = 0; i < scoredCorpus.length; i++){
			console.log('score: ' + scoredCorpus[i].score);
			console.log('date: ' + scoredCorpus[i].date);
			console.log('to: ' + scoredCorpus[i].to);
			console.log('from: ' + scoredCorpus[i].from);
			console.log('message: ' + scoredCorpus[i].text);
			console.log();
		}
		
	});

} else {

	console.log('Please include a --message or -m value');
	process.exit();
}
