# ExChatter API

Below is an outline of the proposed ExChatter API.

## Constructor

```javascript
ExChatter(config, function(){
	// on load callback
})
```
The `config` parameter is an object, or "path/to/model.js":

## Properties

- `id`
- `name`
- `sex`
- `age`
- `location`
- `interests`
- `model`: the language/behavior model that represents the bot
- `conversations`: corpus conversations
- `currentConversation`: live conversation 
- `lastMessage`

## Methods

### Respond

The `respond` method is used to generate a response to any prompt.

```javascript

respond(prompt, function(text, millis){
	/*
		string text: string
		int millis (optional): timeout for response. If ommitted, 

	 */
})
```

### On

The `on` method is ExChatter's event handler. 

```javascript

on(event, callback);
```

It accepts the following events:

```javascript

on('receive', function(text){
	// fired when the respond method is called
});

on('send', function(text){
	// fired when the respond callback is called
});

on('responding', function(percent){
	// fired when percent (i.g. 0.5) of response time has elapsed
})

on('noresponse', function(millis){
	// fired when the ExChatter hasn't received a response in millis milliseconds.
});

on('error', function(err){
    // called on some sort of error
});

```

### Rules

`rules(fn)`

The rules method is used to handle hard coded rules. It is great for extending the ExChatter framework to meet an application's needs. The function `fn` passed into this method will be will be processed right before ExChatter returns a response with the `respond()` method. To have an effect on the output, you must return a string from inside `fn`.

```javascript

rules(function(prompt, response, conversation){
	/*	
		Message prompt: the Message object that was prompted to the bot
		Message response: the Message object that the bot generated as a response (but has not yet sent)
		Conversation conversation: the Conversation object that represents the current chat. Alias of
		the exChatter.currentConversation property.
	 */
});
```

## Example