var PersonalCorpus = require('./classes/PersonalCorpus');

var personalCorpus = new PersonalCorpus();
personalCorpus.generateFromRaw('data/corpuses/cory_feder/raw_iphone.json', 'iphone', function(corpus){
	personalCorpus.save('data/corpuses/cory_feder/corpus.json', function(){
		console.log('saved corpus!');
	});
});