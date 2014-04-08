var PersonalCorpus = require('./classes/PersonalCorpus');

var personalCorpus = new PersonalCorpus();

personalCorpus.generateFromRaw('data/corpuses/cory_feder/raw_iphone.json', 'iphone', function(corpus){
	personalCorpus.save('data/corpuses/cory_feder/corpus.json', function(){
		console.log('saved corpus!');
	});
});

// personalCorpus.load('data/corpuses/cory_feder/corpus.json', function(corpus){

// 	corpus.forEach(function(obj){
// 		console.log(obj.messages.length + " messages with " + obj.number);
// 	});
// 	// console.log(corpus[0].messages.length);
// 	// corpus[0].messages.forEach(function(message){
// 	// 	console.log(message.to);
// 	// 	console.log(message.from);
// 	// 	console.log(message.text);
// 	// 	console.log();
// 	// });
// });
