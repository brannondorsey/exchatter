/*
	A general tester script that is meant to be changed and hacked regularly
	to accommodate quick and dirty needs.
 */

var Contraction = require('./classes/Contraction.js'),
PatternHelper = require('./classes/PatternHelper.js'),
Normalizer = require('./classes/Normalizer'),
MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
_ = require('underscore'),
fs = require('fs'),
util = require('util'),
natural = require('natural'),
argv = require('argv'),
cosine = require('cosine');

var messageObjGenerator = new MessageObjectGenerator();
var patternHelper = new PatternHelper();
var normalizer = new Normalizer();
var tokenizer = new natural.WordTokenizer();

var sentence1 = "I want to help you".split(' ');
var sentence2 = "I want to help you because".split(' ');
console.log(cosine(sentence1, sentence2));