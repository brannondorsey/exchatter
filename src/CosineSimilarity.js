var _cosine = require('cosine');

var CosineSimilarity = function(corpus){
	this._corpus = corpus.slice(); //make a copy
}

CosineSimilarity.prototype.findSimilar = function(query, options){

	var self = this;

	//loop through messages
	this._corpus.forEach(function(message, i){

		var passesAllFilterSets = true;

		// var matchFound;

		if (typeof options.onlyScore === 'object'){
			
			// matchFound = false;
			var matchesFilters = [];

			//for all onlyScore filter objects...
			for (var i = 0; i < options.onlyScore.length; i++) {
				
				var matches = [];
				var filter = options.onlyScore[i];
				var propertyValueIsArray;
				self._filter(message, filter, function(optionValue, propertyName, isArray){
					
					propertyValueIsArray = isArray;
					var pattern = new RegExp(optionValue, 'i');
					if (pattern.test(message[propertyName])) {
						matches.push(true);
					} else matches.push(false);
				});
				
				//if message failed at least one requirement of the instruction
				var passes = (matches.indexOf(false) == -1 || 
					          propertyValueIsArray && matches.indexOf(true) != -1) ? true : false;
				
				matchesFilters.push(passes);
			}

			// if message passes no onlyScore instruction objects
			if (matchesFilters.indexOf(true) == -1) passesAllFilterSets = false; //matchFound = false;
		}
		
		// if (matchFound === false) passesAllInstructionSets = false;

		if (typeof options.dontScore === 'object' && 
			passesAllFilterSets){
			
			self._filter(message, options.dontScore, function(optionValue, propertyName){
				var pattern = new RegExp(optionValue, 'i');
				// this message should be neglected (given a score of 0)
				if(pattern.test(message[propertyName])) passesAllFilterSets = false;
			});
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
			var minScored = scoredCorpus.slice(0, minScoreIndex);
		} else return []; //return an empty array
		
	}

	var returnVal; //use returnVal to protect corpus from manipulation

	//limit number of elements if limit option was included
	if (typeof options.limit !== 'undefined'){
		var temp = (typeof minScored !== 'undefined') ? minScored : scoredCorpus;
		returnVal = temp.slice(0, parseInt(options.limit));
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

//runs fn on each obj's property
CosineSimilarity.prototype._filter = function(message, obj, fn){
	
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
