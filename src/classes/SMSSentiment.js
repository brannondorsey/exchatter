var _ = require('underscore')._,
_sentiment = require('sentiment'),
PatternHelper = require('./PatternHelper');

var _patternHelper = new PatternHelper();

function SMSSentiment() {
	
}

SMSSentiment.prototype.getSentiment = function(string, callback) {
	var sentiment;
	if (!_.isUndefined(string)) {
		_sentiment(string, function(err, result){
			
			if (!err) {
				var emoticons = _patternHelper.getEmoticons(string);
				var positiveEmoticons = _patternHelper.getPositiveEmoticons(string);
				var negativeEmoticons = _patternHelper.getNegativeEmoticons(string);

				result.score += _patternHelper.getSentenceSentimentFromEmoticons(string, 2);
				if (!_.isNull(emoticons)) result.words = result.words.concat(emoticons);
				if (!_.isNull(positiveEmoticons)) result.positive = result.positive.concat(positiveEmoticons);
				if (!_.isNull(negativeEmoticons)) result.negative = result.negative.concat(negativeEmoticons);
			}

			callback(err, result);
		});
	}
}

module.exports = SMSSentiment;