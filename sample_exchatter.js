var tom = new ExChatter('Thomas', config, function(){
	// on load callback
});

var tom = new ExChatter("path/to/toms/model.json", function(){
	
	tom.respond('Hi, how are you?', function(message){
		console.log(message.text);
	});

	tom.on('responding', function(0.8){
		console.log("Tom is typing...");
	});
});

//--------------------------------------------------------------------
// properties

tom.id;
tom.name;
tom.sex;
tom.age;
tom.location;
tom.interests;
tom.model; // the langauge/behavior model that represents the bot
tom.conversations; // corpus conversations
tom.currentConversation; // live conversation 
tom.lastMessage;

//--------------------------------------------------------------------
// methods

tom.respond('Hi, how are you?', function(message, millis){
	/*
		Message text: string
		int millis (optional): timeout for response. If ommitted, 

	 */
});

tom.on('send', function(text){
	// fired when the tom.respond callback is called
});

tom.on('receive', function(text){
	// fired when tom.respond is called
});

tom.on('responding', function(percent){
	// fired when percent (i.g. 0.5) of response time has occured
})

tom.on('noresponse', function(millis){
	// fired when tom hasn't received a response in millis milliseconds.
});

tom.on('error', function(err){
    // called on some sort of error
});


tom.rules(function(prompt, response, conversation){
	/*
		A method to handle hard coded rules.
		This method will be the last function
		to run before the chatBot returns a response with respond().
		using `return someString` will output `someString` as a 
		reponse from the bot.
		
		Message prompt: the Message object that was prompted to the bot
		Message response: the Message object that the bot generated as a response (but has not yet sent)
		Conversation conversation: the Conversation object that represents the current chat. Alias of
		the exChatter.currentConversation property.
	 */
});
