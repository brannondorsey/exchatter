var Contractions = require('./classes/Contractions.js'),
_ = require('underscore');
var contractions = new Contractions();

var sentence = "CNT make it to the show, sorry were running late.";
var cont = [];
var expa = [];

_.each(sentence.split(' '), function(word){
	expa.push(contractions.expand(word));
	cont.push(contractions.contract(word));
});

console.log(contractions.splitSentence("test"));
console.log("Original: " + sentence);
console.log("Contraction: " + cont.join(' '));
console.log("Expansion: " + expa.join(' '));