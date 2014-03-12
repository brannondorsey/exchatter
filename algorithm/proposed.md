1. __Chat layer__: something that goes from the raw text of chat to populate a message object with text, chat context (e.g. n'th message in convo).

2. __NLP analysis stack__: this is more-or-less the same run on utterances and replies and populates the Message object (length, sentiment, key words, etc.)  This is where you can do all the message-specific analysis. You find similar messages to the prompt and grab the response. 

Find get similar messages using

	- Personal Corpus
	- General Corpus
	- ChatterBot Responses
	- Hard Coded Rules


3. __Seed reply ranking__:  this is a matching algorithm between utterance and seed replies on potentially complex decisions over all available Message info: length, topic, sentiment, conversation start, etc.  There's a nice separation of concerns here to break this out of the NLP analysis stack because at matching time, whether using general backoff or personal models, you are still going to use the same tokenization, normalization, etc.

4. __Response generation based on seed reply__.  I'm a little less clear on what this does, but there is definitely a place for algorithms which transform an utterance into another utterance in order to personalize it / make relevant.  I suspect things like:
__denormalization__, e.g. Chance to use multiple letters. I.e. "yesssss".
Some kind of __transformations__ of seed replies into a response - perhaps substitutions.. 
This phase may also include some personal modeling.