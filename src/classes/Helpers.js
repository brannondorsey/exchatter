var _ = require('underscore')._;

function Helpers(){

}

Helpers.prototype.generateID = function(length){

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

Helpers.prototype.getMean = function(array) {
	var sum = 0;
	_.each(array, function(num) {
		sum += num;
	})
	return sum / array.length;
}

Helpers.prototype.getMedian = function(array) {

    array.sort( function(a,b) {return a - b;} );

    var half = Math.floor(array.length/2);

    if(array.length % 2)
        return array[half];
    else
        return (array[half-1] + array[half]) / 2.0;
}

Helpers.prototype.getRange = function(array) {
	return _.max(array) - _.min(array);
}

Helpers.prototype.getVariance = function(array, average) {
	
	if (_.isUndefined(average)) {
		average = this.getMean(array);
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

	return this.getMean(differences);	
}

Helpers.prototype.getStdDeviation = function(array, average) {
	if (_.isUndefined(average)) var average = this.getMean(array);
	var v = this.getVariance(array, average);
	return Math.sqrt(v);
}

//to round to n decimal places
Helpers.prototype.round = function(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

Helpers.prototype.getPercentage = function(part, whole) {
	return part / whole * 100;
}

module.exports = Helpers;