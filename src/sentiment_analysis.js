var fs = require('fs'),
_ = require('underscore')._,
sentiment = require('sentiment');

fs.readFile('data/corpuses/brannon_dorsey/all.json', function (err, data) {
  if (err) throw err;

  var messages = JSON.parse(data);
  console.log(messages.length + " messages.");

  var fromMe = _.where(messages, {from: "Me", to: "8049215907"});
  console.log(fromMe.length + " messages from \"Me\" to ex");

  var sentimentRanked = [];
  var scores = [];
  var callbacksFired = 0;

  	_.each(fromMe, function(message, index) {
  	
		sentiment(message.text, function(err, result){

	  		callbacksFired++;

	  		sentimentRanked.push({
				text: message.text,
				sentiment: result.score
			});

			scores.push(result.score);

			// if all sentiment callbacks have fired
			if (callbacksFired == fromMe.length) {
		
				scores = _.sortBy(scores, function(num){ return - num; });

				console.log("Mean: " + mean(scores));
				console.log("Median: " + median(scores));
				console.log("Range: " + range(scores));
				console.log("Min: " + _.min(scores));
				console.log("Max: " + _.max(scores));
				console.log("Standard Deviation: " + stdDeviation(scores));
				var distribution = sentimentDistribution(scores);
				console.log("Positive Distribution: " + distribution.positive);
				console.log("Neutral Distribution: " + distribution.neutral);
				console.log("Negative Distribution: " + distribution.negative);
			}
		});
  	});
});

function mean(array) {
	var sum = 0;
	_.each(array, function(num) {
		sum += num;
	})
	return sum / array.length;
}

function median(array) {

    array.sort( function(a,b) {return a - b;} );

    var half = Math.floor(array.length/2);

    if(array.length % 2)
        return array[half];
    else
        return (array[half-1] + array[half]) / 2.0;
}

function range(array) {
	return _.max(array) - _.min(array);
}

function variance(array, average) {
	
	if (_.isUndefined(average)) {
		average = mean(array);
	}

	// console.log("Mean: " + average);
	// console.log();

	// printTimes("Values: ", array, 15);
	// console.log();

	var differences = [];

	_.each(array, function(num){
		differences.push(num - average);
	});

	// printTimes("Differences: " , differences, 15);
	// console.log();

	_.each(differences, function(num, i){
		differences[i] = Math.pow(differences[i], 2);
	});

	// printTimes("Differences Squared: " , differences, 15);
	// console.log();

	return mean(differences);	
}

function stdDeviation(array, average) {
	var v = variance(array, average);
	return Math.sqrt(v);
}

/* e.g.
	returns {
		positive: .4,
		neutral: .2, 
		negative: .4
	}
 */
function sentimentDistribution(array) {
	var numPositive = _.partition(array, function(num){ return num > 0 })[0].length;
	var numNegative = _.partition(array, function(num){ return num < 0 })[0].length;
	var numNeutral = array.length - (numPositive + numNegative);
	var total = array.length;	

	return {
		positive: numPositive / total,
		neutral: numNeutral / total,
		negative: numNegative / total
	}
}

function printTimes(prependString, array, num) {
	for (var i = 0; i < num; i++) {
		console.log(prependString + array[i]);
	}
}
