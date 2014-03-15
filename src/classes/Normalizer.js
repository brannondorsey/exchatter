var fs = require('fs'),
_ = require('underscore')._,
natural = require('natural'),
PatternHelper = require('./PatternHelper'),
Contraction = require('./Contraction');

var patternHelper = new PatternHelper();
var contraction = new Contraction();
var slangDictionary;
var ingDictionary;
var dictionaryPath;

function Normalizer() {

	dictionaryPath = 'data/dictionaries';
	slangDictionary = loadSlangDictionary();
	ingDictionary = loadIngDictionary();

}

Normalizer.prototype.normalize = function(string, shouldStem) {

	string = patternHelper.normalizeOnomatos(string);
	string = contraction.expand(string);
	string = this.normalizeSlang(string);
	if (shouldStem) string = this.stem(string); 
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

	if (word in slangDictionary && typeof slangDictionary[word] != 'function') return slangDictionary[word];
	else if (word in ingDictionary && typeof ingDictionary[word] != 'function') return ingDictionary[word];
	else return false;
}

Normalizer.prototype.stem = function(sentence) {

	var sentence = patternHelper.eachWord(sentence, function(word){
		return natural.PorterStemmer.stem(word);
	});
	return sentence;
}

Normalizer.prototype.normalizeMultipleLetters = function(sentence) {

}

// changes ??? to ? and !! to ! etc...
Normalizer.prototype.normalizePunctuation = function(sentence) {

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

function loadIngDictionary() {

	var ingWords = fs.readFileSync(dictionaryPath + '/ing.csv', 'utf8');
	var dictionary = [];
	ingWords = ingWords.split('\n');
	_.each(ingWords, function(ingWord){
		if (ingWord != '') {
			ingWord = ingWord.trim();
			dictionary[ingWord] = ingWord + 'g';
		}
	});
	return dictionary;
}

module.exports = Normalizer;