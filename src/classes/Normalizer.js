var fs = require('fs'),
_ = require('underscore')._,
PatternHelper = require('./PatternHelper'),
Contraction = require('./Contraction');

var patternHelper = new PatternHelper();
var contraction = new Contraction();
var slangDictionary;
var dictionaryPath;

function Normalizer() {
	dictionaryPath = 'data/dictionaries';
	slangDictionary = loadSlangDictionary();

}

Normalizer.prototype.normalize = function(string) {
	string = patternHelper.normalizeOnomatos(string);
	string = contraction.expand(string);
	string = this.normalizeSlang(string);
	return string;
}

Normalizer.prototype.normalizeSlang = function(string) {
	var self = this;
	var returnVal = patternHelper.eachWord(string, function(word){
		var normalizedSlang = self.slangLookup(word.toLowerCase());
		if (normalizedSlang){
			word = patternHelper.matchCase(word, normalizedSlang);	
		} 

		return word;
	});

	return returnVal;
}

// returns string on success, false on nothing found
Normalizer.prototype.slangLookup = function(word) {
	if (word in slangDictionary) return slangDictionary[word];
	else return false;
}

function loadSlangDictionary() {
	var casualMisspellings = fs.readFileSync(dictionaryPath + '/casual_misspellings.csv', 'utf8');
	var textAcronyms = fs.readFileSync(dictionaryPath + '/text_acronyms.csv', 'utf8');

	casualMisspellings = casualMisspellings.split('\n');
	textAcronyms = textAcronyms.split('\n');
	var dictionary = [];
	var lines = casualMisspellings.concat(textAcronyms);
	_.each(lines, function(line){
		if (line != '') {
			items = line.split(',');
			dictionary[items[0].trim()] = items[1].trim();

		}
	});
	return dictionary;
}

module.exports = Normalizer;