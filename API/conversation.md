# Conversation Object

Below is a proposed `Conversation` object. `Conversations` have only properties. 

```javascript

{
	participants: [], // beingIDs
	type: "string" // sms, irc, etc...
	topics: [],
	startMessages: [],
	endMessages: [],
	messages: [], // array of Message objects
	time: {
		start: "string", //ISO-Whatever
		end: "string",
		ellapsed: 120000,
	}
}
```