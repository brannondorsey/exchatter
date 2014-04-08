var PersonalCorpus = require('./PersonalCorpus'),
_cosine = require('cosine'),
_ = require('underscore')._,
_natural = require('natural'),
_fs = require('fs');

function SimilarityMatcher() {
	
	this.sourceModifier = {
		personal: 1,
		combinedPersonal: 0.7,
		pan: 0.7
	}

	this.minScore = 0.75;
}

// returns the nearest response (using timestamp) to a message from the corpus
SimilarityMatcher.prototype.getNearestResponse = function(message, personalCorpus) {
	
	var matchIndex = [];
	
	for (var i = 0; i < personalCorpus.corpus.length; i++) {
		
		var person = personalCorpus.corpus[i];
		var shouldBreak = false;
		
		for (var j = 0; j < person.messages.length; j++) {
			// console.log(message.id);
			if (person.messages[j].id == message.id) {
				matchIndex = [i, j];
				shouldBreak = true;
				break;
			}
		}

		if (shouldBreak) break;
	}

	if (!_.isEmpty(matchIndex)){
		var personIndex = matchIndex[0];
		var messageIndex = matchIndex[1];

		var conversation = personalCorpus.corpus[personIndex].messages;

		for (var i = messageIndex; i < conversation.length; i++) {
			if (conversation[i].from != message.from) {
				return conversation[i];
			} 
		}
	} else return false;

}

SimilarityMatcher.prototype.loadPersonalCorpus = function(filename, callback){

	var self = this;
	_fs.readFile(filename, 'utf-8', function(err, data){
		if (err) throw err;
		self.personalCorpus = JSON.parse(data);
	});
}

// returns an array of similar messages sent to sentTo
SimilarityMatcher.prototype.getSimilar = function(message, sentTo, personalCorpus) {

	var similar = [];
	var self = this;

	var messageWords = [];
	_.each(message.normalized.sentences, function(sentence){
		_.each(sentence.words, function(word){
			messageWords.push(word);
		});
	});

	personalCorpus.eachMessage(function(corpusMessage){
	
		if (corpusMessage.to == sentTo) {

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
		}
		
	});

	similar = _.filter(similar, function(obj){ return obj.score >= self.minScore});
	similar = _.sortBy(similar, function(obj){ return - obj.score });
	return similar;
}

SimilarityMatcher.prototype.getSimilarityScore = function(wordArray1, wordArray2) {

	if (!_.isEmpty(wordArray1) &&
		!_.isEmpty(wordArray2)) {
		
		wordArray1 = _.map(wordArray1, function(word){ return word.toLowerCase() });
		wordArray2 = _.map(wordArray2, function(word){ return word.toLowerCase() });

		var cos = _cosine(wordArray1, wordArray2);
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
			levenshtein += scores[matchIndex];
			uniqWords2.splice(matchIndex, 1);
		}
	});

	return levenshtein;
}

module.exports = SimilarityMatcher;
