var fs = require('fs'),
_ = require('underscore')._;

fs.readFile('data/corpuses/brannon_dorsey/messages_grouped.json', 'utf-8', function(err, data){
	if (err) throw err;
	var corpus = JSON.parse(data);
	corpus = _.sortBy(corpus, function(obj){
		return - obj.messages.length;
	});

	_.each(corpus[1].messages, function(message){
		console.log(message.to);
		console.log(message.from);
		console.log();
	})
});