var PersonalCorpus = require('./classes/PersonalCorpus'),
_ = require('underscore')._,
argv = require('argv');

// Automatically generate all personal corpuses using 
// `source tools/generate_personal_corpuses.txt` from
// the project directory

var args = argv.option([{
	   
	    name: 'person',
	    short: 'p',
	    type: 'string',
	    description: 'Defines the corpus folder to use in "data/corpuses/" to use',
	    example: "'script --person=value' or 'script -p value'"
	}]).run().options;

if (!_.isUndefined(args.person)) {

	var personalCorpus = new PersonalCorpus();
	console.log('Generating personal corpus for ' + args.person);
	personalCorpus.generateFromRaw('data/corpuses/' + args.person + '/raw_iphone.json', 'iphone', function(corpus){
		personalCorpus.save('data/corpuses/' + args.person + '/corpus.json', function(){
			console.log('Saved corpus to data/corpuses/' + args.person + '/corpus.json');
			console.log();
		});
	});
} else argv.help();
