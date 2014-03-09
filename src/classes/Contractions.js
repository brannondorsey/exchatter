var fs = require('fs'),
_ = require('underscore')._;

function Contractions(){

	var contractionsFile = fs.readFileSync("data/dictionaries/contractions.csv", "utf8");
	
	var lines = contractionsFile.split("\n");
	var contractions = [];

	_.each(lines, function(line){
		var columns = line.split(",");
		var contraction = {};
		contraction.contraction = columns[0].trim();
		contraction.expansion = columns[1].split(";");
		_.each(contraction.expansion, function(element, i){
			contraction.expansion[i] = element.trim();
		});
		if (!_.isUndefined(columns[2])) {
			contraction.misspellings = columns[2].split(";");
			_.each(contraction.misspellings, function(element, i){
				contraction.misspellings[i] = element.trim();
			});
		}

		contractions.push(contraction);
	});

	this.contractions = contractions;
}

Contractions.prototype.expand = function(string, options){

	// be sure to check if is capitalized and return using same style
	
	var match = _.findWhere(this.contractions, { contraction: string });
	
	if (_.isUndefined(match)) {
		_.each(this.contractions, function(obj){
			var index = _.indexOf(obj.misspellings, string);
			if (index != -1) {
				match = obj;
				return;
			} 
		});
	}

	if (!_.isUndefined(match)) {
		return match.expansion[0];
	} else {
		return string;
	}
}

Contractions.prototype.contract = function(){

}

module.exports = Contractions;