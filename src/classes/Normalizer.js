var _fs = require('fs'),
_ = require('underscore')._,
_natural = require('natural'),
PatternHelper = require('./PatternHelper'),
Contraction = require('./Contraction');

var _patternHelper = new PatternHelper();
var _contraction = new Contraction();
var _slangDictionary;
var _ingDictionary;
var _dictionaryPath;

function Normalizer() {

	_dictionaryPath = 'data/dictionaries';
	_slangDictionary = _loadSlangDictionary();
	_ingDictionary = _loadIngDictionary();

}

Normalizer.prototype.normalize = function(string, shouldStem) {

	string = _patternHelper.normalizeOnomatos(string);
	string = this.normalizeMultipleLetters(string);
	string = this.normalizeSlang(string);
	string = _contraction.expand(string);
	string = this.normalizePunctuation(string);
	if (shouldStem) string = this.stem(string); 
	return string;
}

Normalizer.prototype.normalizeSlang = function(string) {

	var self = this;
	var returnVal = _patternHelper.eachWord(string, function(word){
		var normalizedSlang = self.slangLookup(word.toLowerCase());
		
		if (normalizedSlang){
			word = _patternHelper.matchCase(word, normalizedSlang);
		} 

		return word;
	});

	return returnVal;
}

// returns string on success, false on nothing found
Normalizer.prototype.slangLookup = function(word) {

	if (word in _slangDictionary && typeof _slangDictionary[word] != 'function') return _slangDictionary[word];
	else if (word in _ingDictionary && typeof _ingDictionary[word] != 'function') return _ingDictionary[word];
	else return false;
}

Normalizer.prototype.stem = function(sentence) {

	var sentence = _patternHelper.eachWord(sentence, function(word){
		return _natural.PorterStemmer.stem(word);
	});
	return sentence;
}

Normalizer.prototype.normalizeMultipleLetters = function(sentence) {
	var sentence = _patternHelper.eachWord(sentence, function(word){
		return _patternHelper.replaceThreeOrMoreOfTheSameChars(word);
	});
	return sentence;
}

// changes ??? to ? and !! to ! etc...
Normalizer.prototype.normalizePunctuation = function(sentence) {
	return _patternHelper.replaceMultipleInterrobangies(sentence);
}

function _loadSlangDictionary() {

	var casualMisspellings = _fs.readFileSync(_dictionaryPath + '/casual_misspellings.csv', 'utf8');
	var textAcronyms = _fs.readFileSync(_dictionaryPath + '/text_acronyms.csv', 'utf8');

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

function _loadIngDictionary() {

	var ingWords = _fs.readFileSync(_dictionaryPath + '/ing.csv', 'utf8');
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