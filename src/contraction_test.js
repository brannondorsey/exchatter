var Contractions = require('./classes/Contractions.js'),
_ = require('underscore');
var contractions = new Contractions();

var sentence = "Howl make it to the cant sorry were running late.";
var cont = [];
var expa = [];

_.each(sentence.split(' '), function(word){
	expa.push(contractions.expand(word));
	cont.push(contractions.contract(word));
});

// console.log(contractions.splitSentence(sentence));
console.log("Original: " + sentence);
console.log("Contraction: " + cont.join(' '));
console.log("Expansion: " + expa.join(' '));