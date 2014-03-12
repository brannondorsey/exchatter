var fs = require('fs'),
_ = require('underscore')._;

function Contraction(){

	var contractionsFile = fs.readFileSync("data/dictionaries/contractions.csv", "utf8");
	
	var lines = contractionsFile.split("\n");
	var contractions = [];

	_.each(lines, function(line){
		var columns = line.split(",");
		var contraction = {};
		contraction.contraction = columns[0].trim();
		contraction.expansion = columns[1].split(";");
		_.each(contraction.expansion, function(element, i){
			contraction.expansion[i] = element.trim();
		});
		if (!_.isUndefined(columns[2])) {
			contraction.misspellings = columns[2].split(";");
			_.each(contraction.misspellings, function(element, i){
				contraction.misspellings[i] = element.trim();
			});
		}

		contractions.push(contraction);
	});

	this.contractions = contractions;
}

/*
	options: {
		misspelled: true,
		tense: "present"
	}
 */
Contraction.prototype.expand = function(string, options){
	
	var words = [];
	var self = this;
	_.each(string.split(' '), function(word){
		if (word != '') words.push(self._tranlateWord("expansion", word, options));
	});

	return words.join(' ');
	
}

Contraction.prototype.contract = function(string, options){
	
	var words = [];
	var self = this;
	_.each(string.split(' '), function(word){
		if (word != '') words.push(self._tranlateWord("contraction", word, options));
	});

	return words.join(' ');
}

Contraction.prototype.splitPunctuation = function(string){
	var string = string.replace(/[^\w\s']|_/g, function ($1) { return ' ' + $1 + ' ';})
	string = string.replace(/[ ]+/g, ' ').split(' ');
	var nullChar = _.indexOf(string, '');
	if (nullChar != -1) {
		string.splice(nullChar, 1);
	}
	return string;
}

Contraction.prototype._tranlateWord = function(type, string, options){

	var word = this.splitPunctuation(string);
	var self = this;
	
	if (word.length > 1) {

		var actualWord;
		var punctuation = "";

		var temp = [];

		_.each(word, function(part){

			if (!/[^\w\s\n\t']|_/.test(part)) {
				// actualWord = part;
				temp.push(self._translate(type, part, options));
			} else {
				temp.push(part);
			}
		});

		word = temp.join('');
		// word = self._translate(type, actualWord, options);
		// word += punctuation;
	} else {
		word = self._translate(type, word[0], options);
	}

	return word;
}

Contraction.prototype._translate = function(type, string, options){

	var matchUsing = (type == "expansion")? "contraction" : "expansion"; 
	// be sure to check if is capitalized and return using same style
	var isFirstCap = (string.charAt(0) == string.charAt(0).toUpperCase());
	var isAllCaps = (string == string.toUpperCase());
	var string = string.toLowerCase();
	
	var match;

	_.each(this.contractions, function(obj){
		if (_.isArray(obj[matchUsing])) {
			_.each(obj[matchUsing], function(word){
				
				if (word.toLowerCase() == string) {
					match = obj;
					return;
				}
			});
		} else {
			if (obj[matchUsing].toLowerCase() == string) {
				match = obj;
				return;
			}
		}
	});
	
	if (_.isUndefined(match)) {
		
		_.each(this.contractions, function(obj){
			
			var misspellings = _.map(obj.misspellings, function(word){
				return word.toLowerCase();
			});

			var index = _.indexOf(obj.misspellings, string);
			if (index != -1) {
				match = obj;
				return;
			} 
		});
	}
	
	var returnVal;

	if (!_.isUndefined(match)) {
		if (_.isArray(match[type])) {
			returnVal = match[type][0];
		} else {
			returnVal = match[type];
		}
	} else {
		returnVal = string;
	}

	if (isFirstCap){
		returnVal = returnVal.charAt(0).toUpperCase() + returnVal.substring(1);
	}
	if (isAllCaps) returnVal = returnVal.toUpperCase();
	
	return returnVal;
}

module.exports = Contraction;
