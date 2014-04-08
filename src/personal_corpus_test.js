var PersonalCorpus = require('./classes/PersonalCorpus');

var personalCorpus = new PersonalCorpus();
personalCorpus.generateFromRaw('data/corpuses/brannon_dorsey/raw_iphone.json', 'iphone', function(corpus){
	personalCorpus.save('data/corpuses/brannon_dorsey/corpus.json', function(){
		console.log('saved corpus!');
	});
});