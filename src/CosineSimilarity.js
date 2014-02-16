var _cosine = require('cosine');

var CosineSimilarity = function(corpus){
	this._corpus = corpus;
}


/*
	minScore: 68,
	limit: 20,


 */
CosineSimilarity.prototype.findSimilar = function(query, options){

	var self = this;
	//loop through
	this._corpus.forEach(function(message, i){

		var passesOptions = true;

		var matchFound = false;

		self._filter(message, options.include, function(optionValue, propertyName){
			if(message[propertyName] == optionValue) matchFound = true;
		});
		
		if (!matchFound) passesOptions = false;

		if (passesOptions){
			self._filter(message, options.neglect, function(optionValue, propertyName){
				// this message should be neglected (given a score of 0)
				if(message[propertyName] == optionValue) passesOptions = false; 
			});
		}
		

		// if (typeof options.include == 'object'){

		// 	//for each property that was included in "include"
		// 	for(var propertyName in options.include){
		
		// 		//if correct var type (array) was passed into option's "include"
		// 		if(options.include[propertyName] instanceof Array){
				
		// 			var matchFound = false;

		// 			options.include[propertyName].forEach(function(requirement){
		// 				if(message[propertyName] == requirement) matchFound = true;
		// 			});
					
		// 			if (!matchFound) passesOptions = false;

		// 		} else {
		// 			if(message[propertyName] !== options.include[propertyName]) passesOptions = false;
		// 		}
		// 	}
		// }

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

	var returnVal; //use returnVal to protect corpus from manipulation

	//limit number of elements if limit option was included
	if (typeof options.limit !== 'undefined') returnVal = scoredCorpus.slice(0, parseInt(options.limit));
	else returnVal = scoredCorpus;

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
