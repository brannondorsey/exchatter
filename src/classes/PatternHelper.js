var _ = require('underscore')._;

var emoticons = {
		has: {
			positive: /[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}[\)\]bpPD>]/,
			neutral: /[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}((\[\])|(\(\))|[oO])/,
			negative: /[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}[XcC\/\\(|\[[Ss?]/
		},
		is: {
			positive: /^[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}[\)\]bpPD>]$/,
			neutral: /^[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}((\[\])|(\(\))|[oO])$/,
			negative: /^[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}[XcC\/\\(|\[[Ss?]$/
		}
}

var onomatos = [];
onomatos['aww']  = /^a+w+$/gi;
onomatos['yay']  = /^y+a+y+$/gi;
onomatos['hm']   = /^h+m+$/gi;
onomatos['haha'] = /^(he|ha){2,}$/gi; // also hehe
onomatos['lol']  = /^(lol){1,}(ol)*$/gi;
onomatos['hah']  = /^h+a+h*$/gi; // or haaaa
onomatos['wo']   = /^w+o+$/gi;
onomatos['wow']  = /^w+o+w+$/gi;
onomatos['ugh']  = /^u+g+h+$/gi;
onomatos['ah']   = /^a+h+$/gi;
onomatos['um']   = /^u+(h+)?m+$/gi; // also uhm
onomatos['oh']   = /^o+h+$/gi;
onomatos['oo']   = /^o{2,}$/gi;
onomatos['ew']   = /^e+w+$/gi;
onomatos['woohoo'] = /^w[oa]+h+[oa]{2,}$/gi; // also waahooo wahooo
onomatos['woop'] = /^w+o{2,}p+$/gi;
onomatos['yee']  = /^y+e{2,}$/gi;
onomatos['eee']  = /^e{3,}$/gi;
onomatos['uh']   = /^u+h+$/gi;
onomatos['egh']  = /^e+g+h+$/gi;
onomatos['agh']  = /^a+g+h+$/gi;
onomatos['oof']  = /^o{2,}f$/gi;
onomatos['mm']   = /^m{2,}$/gi;
onomatos['mhm']  = /^m+h+m+$/gi;
onomatos['meh']  = /^m+e+h+$/gi;
onomatos['grr']  = /^((g{2,}r+)|(g+r{2,}))$/gi; // also ggr but not gr
onomatos['hmph'] = /^h+m+p+h+$/gi;
onomatos['argh'] = /^a+r+g+h+$/gi;
onomatos['gah']  = /^((g+a+h+)|((g+a{2,})|(g{2,}a+)))$/gi; // also gaa but not ga
onomatos['err']  = /^e+r+$/gi;
onomatos['zzz']  = /^z{2,}$/gi;
onomatos['whoops'] = /^w+(h+)$/gi;

var punctuation = /[^\w\s']|_/g;

// patterns for accepting any *ing word if it is *in
// patterns for *cha. Break on the * and split into * and you.


function PatternHelper() {

}

PatternHelper.prototype.isOnomato = function(word) {
	
	var returnVal = false;
	_.each(onomatos, function(key, regex){
		if (regex.test(word)) {
			returnVal = true;
			return;
		}
	});
	return returnVal;
}

PatternHelper.prototype.getOnomato = function(word) {
	
	var returnVal = false;
	_.each(onomatos, function(key, regex){
		if (regex.test(word)) {
			returnVal = key;
			return;
		}
	});
	return returnVal;
}

PatternHelper.prototype.normalizeOnomatos = function(sentence) {

	var words = sentence.split(' ');
	var newWords = [];
	var self = this;

	_.each(words, function(word){
		
		var matchFound = false;
		
		word = word.trim();
		var originalWord = word;
		var wordArray = self.splitPunctuation(word);
		var punctuation = [];

		if (wordArray.length > 1) {

			word = wordArray[0];
			punctuation = wordArray.slice(1);
		}
		for (var key in onomatos){

			var regex = onomatos[key];
			if (regex.test(word)) {
				word = key;
				matchFound = true;
				break;
			} 
		}

		if (punctuation.length > 0) {
			_.each(punctuation, function(char){
				word += char;
			});
		}

		newWords.push(self.matchCase(originalWord, word));
	});

	return newWords.join(' ');
}

PatternHelper.prototype.eachWord = function(sentence, fn) {

	var words = sentence.split(' ');
	var newWords = [];
	var self = this;

	_.each(words, function(word){
		
		word = word.trim();
		var originalWord = word;
		var wordArray = self.splitPunctuation(word);
		var punctuation = [];

		if (wordArray.length > 1) {

			word = wordArray[0];
			punctuation = wordArray.slice(1);
		}
		
		word = fn(word);

		if (punctuation.length > 0) {
			_.each(punctuation, function(char){
				word += char;
			});
		}

		newWords.push(word);
	});

	return newWords.join(' ');
}

PatternHelper.prototype.isEmoticon = function(word) {
	
	if (emoticons.is.positive.test(word)) return true;
	else if (emoticons.is.neutral.test(word)) return true;
	else if (emoticons.is.negative.test(word)) return true;
	else return false;
}

PatternHelper.prototype.hasEmoticon = function(sentence) {

	if (emoticons.has.positive.test(word)) return true;
	else if (emoticons.has.neutral.test(word)) return true;
	else if (emoticons.has.negative.test(word)) return true;
	else return false;
}

PatternHelper.prototype.getEmoticons = function(sentence) {

	var emoticons = [];
	var array = emoticons.has.positive.exec(sentence);
	if (array != null) emoticons.concat(array);
	var array = emoticons.has.neutral.exec(sentence);
	if (array != null) emoticons.concat(array);
	var array = emoticons.has.negative.exec(sentence);
	if (array != null) emoticons.concat(array);
	return (emoticons.length > 0) ? emoticons : false;

}

PatternHelper.prototype.getEmoticonSentiment = function(word) {

	if (emoticons.is.positive.test(word)) return true;
	else if (emoticons.is.neutral.test(word)) return true;
	else if (emoticons.is.negative.test(word)) return true;
	else return false;
}

PatternHelper.prototype.isEmoji = function(string) {

}

PatternHelper.prototype.hasEmoji = function(string) {
	
}

PatternHelper.prototype.getEmojiSentiment = function(string) {

}

PatternHelper.prototype.isQuestion = function(string) {
	return /[^:;8=^]\?$/gi.text(string); // ^[emoticon eyes and noses]
}

PatternHelper.prototype.hasQuestion = function(string) {
	return /[^:;8=^]\?/gi.text(string); // ^[emoticon eyes and noses]
}

// haha, hehe, lol, hah, etc...
PatternHelper.prototype.isLaugh = function (word) {
	
	if (onomatos['_haha'].test(word)) return true;
	else if (onprototype.omatos['_hah'].test(word)) return true;
	else if (onomatos['_lol'].test(word)) return true;
	else return false;
}

PatternHelper.prototype.hasLaugh = function(sentence) {

	if (onomatos['_haha'].test(sentence)) return true;
	else if (onomatos['_hah'].test(sentence)) return true;
	else if (onomatos['_lol'].test(sentence)) return true;
	else return false;
}

PatternHelper.prototype.hasMultipleSentences = function(string) {

}

PatternHelper.prototype.splitPunctuation = function(string){

	var string = string.replace(/[^\w\s']|_/g, function ($1) { return ' ' + $1 + ' ';})
	string = string.replace(/[ ]+/g, ' ').split(' ');
	var nullChar = _.indexOf(string, '');
	if (nullChar != -1) {
		string.splice(nullChar, 1);
	}
	return string;
}

// only matches case of First letter or entire WORD
PatternHelper.prototype.matchCase = function(input, output) {

	// first cap
	if (input.charAt(0) == input.charAt(0).toUpperCase()) {
		output = output.charAt(0).toUpperCase() + output.substring(1);
	}
	// all cap
	if (input == input.toUpperCase()){
		output = output.toUpperCase();
	}
	return output;
}


module.exports = PatternHelper;
