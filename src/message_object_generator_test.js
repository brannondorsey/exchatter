var MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
PatternHelper = require('./classes/PatternHelper');
util = require('util');
var messageObjGenerator = new MessageObjectGenerator();
var patternHelper = new PatternHelper();

var message = "Heyyyyy, how are you ;-) Do you still want to  :( go to da movies later today :)";
messageObjGenerator.getMessageObject(message, undefined, undefined, function(messageObj){

	console.log(util.inspect(messageObj, {colors: true, depth: 4}));
});
