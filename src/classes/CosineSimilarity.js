var _cosine = require('cosine');

var CosineSimilarity = function(corpus){
	this._corpus = corpus.slice(); //make a copy
}

CosineSimilarity.prototype.findSimilar = function(query, options){

	var self = this;

	//loop through messages
	this._corpus.forEach(function(message, i){

		//boolean holding wether this message passes ALL filters
		var passesAllFilterSets = true;

		if (options.onlyScore instanceof Array){
			passesAllFilterSets = self._passesFilter(options.onlyScore, message, true);
		}

		if (options.dontScore instanceof Array &&
			passesAllFilterSets){
			passesAllFilterSets = self._passesFilter(options.dontScore, message, false, true);
			if (passesAllFilterSets) {
				//console.log(passesAllFilterSets);
			}
		}

		//calculate similarity score
		var score = (passesAllFilterSets) ? _cosine(query.split(' '), message.text.split(' ')) : 0;
		message.score = score;

		if (options.preference instanceof Array) {
			options.preference.forEach(function(preference){
				
				self._filter(message, preference, function(optionValue, propertyName){
					
					var pattern = new RegExp(optionValue, 'i');

					if(propertyName != 'modifier' &&
					   pattern.test(message[propertyName])){
						message.score += parseFloat(preference.modifier);
					}
				});
			});
		}

	});

	//sort corpus by score, highest first
	var scoredCorpus = this._corpus.slice().sort(function(a, b){
		if (a.score < b.score)
		     return 1;
		if (a.score > b.score)
		    return -1;
		return 0;
	});

	if (typeof options.minScore !== 'undefined') {

		var minScore = parseFloat(options.minScore);
		var minScoreIndex;

		// console.log('minScore is ' + minScore);
		for (var i = 0; i < scoredCorpus.length; i++) {
		
			if (scoredCorpus[i].score >= minScore) {
				// console.log("this score was " + scoredCorpus[i].score + ' and the index was ' + i);
				minScoreIndex = i;
			} else break;
		}
		// console.log(minScoreIndex);
		if (typeof minScoreIndex !== 'undefined') {
			var minScored = (minScoreIndex != 0) ? scoredCorpus.slice(0, minScoreIndex) : [scoredCorpus[0]];
			// console.log(minScored);
		} else return []; //return an empty array
		
	}

	var returnVal; //use returnVal to protect corpus from manipulation

	//limit number of elements if limit option was included
	if (typeof options.limit !== 'undefined'){
		var temp = (typeof minScored !== 'undefined') ? minScored : scoredCorpus;
		returnVal = (temp.length > 1) ? temp.slice(0, parseInt(options.limit)) : temp;
	} 
	else returnVal = (typeof minScored !== 'undefined') ? minScored : scoredCorpus;

	return returnVal;
}

CosineSimilarity.prototype.replaceCorpus = function(corpus){
	this._corpus = corpus;
}

CosineSimilarity.prototype.getCorpus = function(){
	return this._corpus;
}

CosineSimilarity.prototype._passesFilter = function(filterObjArray, message) {
	
	// boolean array that holds which onlyScore objects 
	// message passes (represented as `true`)
	var matchesFilters = [];

	//for all onlyScore filter objects...
	for (var i = 0; i < filterObjArray.length; i++) {
		
		var matches = [];
		var filterObj = filterObjArray[i];
		var propertyValueIsArray; //boolean

		this._forEachFilterObjProp(message, filterObj, function(value, propertyName, isArray){
			
			propertyValueIsArray = isArray;
			var pattern = new RegExp(value, 'i');
			var isMatch = (pattern.test(message[propertyName])) ? true : false;
			matches.push(isMatch);

		});

		var passes = (matches.indexOf(false) == -1 || 
			          propertyValueIsArray && matches.indexOf(true) != -1) ? true : false;
		// || strict && matches.indexOf(true) == -1
		
		matchesFilters.push(passes);
	}
	return (matchesFilters.indexOf(true) != -1)
	//return (strict) ? (matchesFilters.indexOf(false) != -1) : (matchesFilters.indexOf(true) != -1);
}

//runs fn on each obj's property
CosineSimilarity.prototype._forEachFilterObjProp = function(message, obj, fn){
	
	if (typeof obj == 'object'){

		//for each property that was included in "include"
		for(var propertyName in obj){
			
			var isArray;

			//if correct var type (array) was passed into option's "include"
			if(obj[propertyName] instanceof Array){
				isArray = true;
				obj[propertyName].forEach(function(requirement){
					fn(requirement, propertyName, isArray);
				});

			} else {
				isArray = false;
				fn(obj[propertyName], propertyName, isArray);
			}
		}
	} 
}

module.exports = exports = CosineSimilarity;
