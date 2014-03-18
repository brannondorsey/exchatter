var MessageObjectGenerator = require('./classes/MessageObjectGenerator'),
util = require('util');
var messageObjGenerator = new MessageObjectGenerator();

var message = "Daaaaang dawg I kno wha you mean :)";
messageObjGenerator.getMessageObject(message, undefined, undefined, function(messageObj){

	console.log(util.inspect(messageObj, {colors: true, depth: 4}));
});
