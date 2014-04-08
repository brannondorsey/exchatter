var SimilarityMatcher = require('./classes/SimilarityMatcher');
var similarityMatcher = new SimilarityMatcher();

var sentence1 = 'What\'s up dude are you cold';
var sentence2 = 'whaaaaats up dude are you cald';

similarityMatcher.getSimilarity(sentence1.split(' '), sentence2.split(' '));