var _cosine = require('cosine');

var CosineSimilarity = function(corpus){
	this._corpus = corpus;
}

CosineSimilarity.prototype.findSimilar = function(query, options){

	var self = this;

	//loop through messages
	this._corpus.forEach(function(message, i){

		var passesOptions = true;

		var matchFound = false;

		if (typeof options.includeOnly === 'object'){
			self._filter(message, options.includeOnly, function(optionValue, propertyName){
				if(message[propertyName] == optionValue) matchFound = true;
			});
		}
		
		if (!matchFound) passesOptions = false;

		if (typeof options.includeOnly === 'object' && 
			passesOptions){

			self._filter(message, options.ignore, function(optionValue, propertyName){
				// this message should be neglected (given a score of 0)
				if(message[propertyName] == optionValue) passesOptions = false; 
			});
		}

		//calculate similarity score
		var score = (passesOptions) ? _cosine(query.split(' '), message.text.split(' ')) : 0;
		message.score = score;
	});

	//sort corpus by score, highest first
	var scoredCorpus = this._corpus.sort(function(a, b){
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

CosineSimilarity.prototype.updateCorpus = function(corpus){
	this._corpus = corpus;
}

CosineSimilarity.prototype.getCorpus = function(){
	return this._corpus;
}

//uses applies query parameters passed using options
CosineSimilarity.prototype._filter = function(message, obj, fn){
	
	if (typeof obj == 'object'){

		//for each property that was included in "include"
		for(var propertyName in obj){
	
			//if correct var type (array) was passed into option's "include"
			if(obj[propertyName] instanceof Array){

				obj[propertyName].forEach(function(requirement){
					fn(requirement, propertyName);
				});

			} else {
				fn(obj[propertyName], propertyName);
			}
		}
	} 
}

module.exports = exports = CosineSimilarity;
