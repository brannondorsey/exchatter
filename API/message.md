# Message Object

Below is an outline for the proposed `Messages` object, a standard for representing SMS or chat style utterances of all types. User utterances, corpus messages, and even generated messages will be used and stored in this format.
Note that the `Message` object does not have any methods, only properties.

```javascript

	{
		id: "sha1",
		sender: "string",
		source: "string", // e.g. "personal corpus", "general corpus", "prompt", "generated"
		text: "string", // the text message
		sentences: [{
			sentence: "string",
			isQuestion: false,
			subjects: [],
			wordOrder: [], // array of chars "n", "v", "a", etc... of each word in the message
			misspellings: [{
				word: "string",
				fix: "string"
			}],
			punctuation: [], // list of all punctuation characters in order (excluding emoticons)
			contractions: [],
			abbreviations: [],
			emoticons: [],
			stopWords: [],
			words: [{
				word: "string",
				sentence: "string",
				partOfSpeech: "string",
				isSubject: true,
				isEmoticon: false,
				isStopWord: false,
				synonyms: []
		}],
		sentiment: {
			score: 0.4,
			positiveWords: [],
			neutralWords: [],
			negativeWords: []
		},
		topics: [], // array of topic words
		time: {
			response: 54000, // time in millis elapsed between prompt recieved and message sent
			prompt: 13000, // time in millis elapsed between last message sent and prompt
		},
		normalized: {
			text: "string", // the text message
			sentences: [] // same as non-normalized sentences array
		}
	}		

```

## Example

```javascript

var message = new Message("I'm not feelin too well.");

console.log(message.text);
console.log(message.normalized);
console.log(message.sentiment.score);
console.log(message.sentences[0].isQuestion);
```

Would print

```
> I'm not feelin too well.
> I am not feeling too well.
> -1
> false
```