/*
conversation
	.participants // assoc array
		.age // int
		.sex // string
		.location // string
		.topics (interests) // array
		.messages // array (instances of Message)
		.sentiment // obj (instance of Sentiment)
			.positive // float
			.neutral // float
			.negative // float

	.time // float (millis): since start
	.isResponse
	.time // total length of 
	.messages // array of all messages in conversation
	.topics		
*/