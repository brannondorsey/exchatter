var cosine = require('cosine'),
PersonalCorpus = require('./PersonalCorpus');
_ = require('underscore')._,
_natural = require('natural'),
_fs = require('fs');

function SimilarityMatcher(callback) {
	
	this.sourceModifier = {
		personal: 1,
		combinedPersonal: 0.7,
		pan: 0.7
	}

	this.minScore = 0.6;
	// callback = _.after(1, callback);
	// _fs.readFiles();
	// Load personal corpus
}

SimilarityMatcher.prototype.getNearestResponse = function(message, personalCorpus) {
	var similar = this.getSimilar(message, personalCorpus);
	var mostSimilar = _.find(personalCorpus.messages, function(message){
		return message.id == similar[0].message.id;
	});
}

SimilarityMatcher.prototype.loadPersonalCorpus = function(filename, callback){

	var self = this;
	_fs.readFile(filename, 'utf-8', function(err, data){
		if (err) throw err;
		self.personalCorpus = JSON.parse(data);
	});
}

SimilarityMatcher.prototype.getSimilar = function(message, personalCorpus) {

	var similar = [];
	var self = this;

	personalCorpus.eachMessage(function(corpusMessage){
		
		var messageWords = [];
		_.each(message.normalized.sentences, function(sentence){
			_.each(sentence.words, function(word){
				messageWords.push(word);
			});
		});

		var corpusMessageWords = [];
		_.each(corpusMessage.normalized.sentences, function(sentence){
			_.each(sentence.words, function(word){
				corpusMessageWords.push(word);
			});
		});
		
		var score = self.getSimilarityScore(messageWords, corpusMessageWords);
		
		similar.push({
			score: score,
			message: corpusMessage
		});
	});

	similar = _.sortBy(similar, function(obj){ return - obj.score });
	return similar;
}

SimilarityMatcher.prototype.getSimilarityScore = function(wordArray1, wordArray2) {

	if (!_.isEmpty(wordArray1) &&
		!_.isEmpty(wordArray2)) {
		
		wordArray1 = _.map(wordArray1, function(word){ return word.toLowerCase() });
		wordArray2 = _.map(wordArray2, function(word){ return word.toLowerCase() });

		var cos = cosine(wordArray1, wordArray2);
		var lev = this._getLevenshteinDistance(wordArray1, wordArray2);
		return cos;

	} else return 0;
	
}

SimilarityMatcher.prototype.getMostSimilarMessageObjects = function(messageObj){

}

SimilarityMatcher.prototype._getLevenshteinDistance = function(wordArray1, wordArray2) {

	var uniqWords1 = _.filter(wordArray1, function(word){ return wordArray2.indexOf(word) == -1 });
	var uniqWords2 = _.filter(wordArray2, function(word){ return wordArray1.indexOf(word) == -1 });
	var levenshtein = 0;

	_.each(uniqWords1, function(uniqWord1){

		var scores = [];
		_.each(uniqWords2, function(uniqWord2){
			scores.push(_natural.LevenshteinDistance(uniqWord1, uniqWord2));
		});

		if (!_.isEmpty(scores)){
			var matchIndex = scores.indexOf(_.min(scores))
			// console.log("Match: " + uniqWord1 + ", " + uniqWords2[matchIndex]);
			levenshtein += scores[matchIndex];
			uniqWords2.splice(matchIndex, 1);
		}
	});

	return levenshtein;
}

module.exports = SimilarityMatcher;
