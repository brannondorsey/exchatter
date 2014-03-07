/*
	One emoticon for each of the following:
	- hat, eyes, nose, mouth
	- hat, eyes, mouth
	- eyes, nose, mouth
	- eyes, mouth
 */

var fs = require('fs'),
_ = require('underscore')._;

fs.readFile('data/emoticons/emoticon_generation.json', function (err, data) {

		var features = JSON.parse(data);
		var hats = features[0];
		var eyes = features[1];
		var noses = features[2];
		var mouths = features[3];

	// - hat, eyes, nose, mouth
	_.each(hats, function(hat, i){
		_.each(eyes, function(eye){
			_.each(noses, function(nose){
				_.each(mouths, function(mouth, j){
					printEmoticon([hat, eye, nose, mouth]);
					printEmoticon([hat, eye, mouth]);
					printEmoticon([eye, nose, mouth]);
					printEmoticon([eye, mouth]);
				});
			});
		});
	});
});

function printEmoticon(emoticon){
	var uniq = _.uniq(emoticon);
	if (emoticon.length == uniq.length) {
		console.log(emoticon.join(''));
	}
}