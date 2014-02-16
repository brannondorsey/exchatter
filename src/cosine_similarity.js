var cosineSimilarity = require('cosine'),
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
	var corpusMessages = [];

	fs.readFile('data/all_combined.json', function(err, data){
		

		if (err) throw err;
		var corpus = JSON.parse(data);

		corpus.forEach(function(message, i){
		
			var score = cosineSimilarity(input.split(' '), message.text.split(' '));
			message.score = score;
		});

		//sort 
		var scoredCorpus = corpus.sort(function(a, b){
			if (a.score < b.score)
			     return 1;
			if (a.score > b.score)
			    return -1;
			return 0;
		});

		filter({
			include: {
				from: [8042126625],
				to: []
			},
			exlude{	

			},
			preference: {
				to: "Me",
				percent: .7
			},
			callback: function(reOrderedMessages){

			}
		});

		console.log(scoredCorpus);
		//console.log(scoredCorpus[0].text + ' | score: ' + scoredCorpus[0].score);
	});
} else {

	console.log('Please include a --message or -m value');
	process.exit();
}

/*

	options{

		include{
			
		}
	}
	
 */
function filter(options){

	if (typeof include == 'object'){
		for(var key in include){

		}
	}

	if (typeof exclude != 'undefined') {

	}

}
