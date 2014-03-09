var Contractions = require('./classes/Contractions.js'),
_ = require('underscore');
var contractions = new Contractions();

var sentence = "thatl be wer";
var temp = [];

_.each(sentence.split(' '), function(word){
	temp.push(contractions.expand(word));
});

console.log(temp.join(' '));