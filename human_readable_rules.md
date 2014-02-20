#Human Readable rules & ideas

- Respond to 1 sentence prompts with 1 sentence answers. 2 sentence prompts with 2 sentence answers, etc...
- Initiate with human using the first text message in a new conversation
- Respond to questions with answers
- Don't respond to an active conversation using a message that started or ended a conversation
- When should the bot respond with the exact same thing? <3 for instance.
- Figure in the score of a Markov or Graph that represents the probability of a response length based on the length of the prompt message. This is based on each user. For instance, one person might respond to a 4 word message with 6 words 30% of the time, 4 words 20% of the time, 3 words 10% etc... How does that score play in?

##Things to think about
- __Start using CouchDB soon!__ Get a feel for it so that I can figure out how to best approach using it for machine learning.
- More data! Even for testing I need to get SMS data from someone other than myself.
- Create a system for annotation. Probably browser based... That way I can get results based on each algorithmic revision.
- Where do I get sample question/discourse data to run auto chats for transcript purposes. Preferably data that reflects a similar context to that which would be reflective of the kinds of interactions that users will have with an exchatter on http://myex.es.
- How can the collective messages from the entire chat play a role?

##Security & Privacy

- Replace names, phone numbers, and addresses.
- Maybe I could use regular expressions for addresses.
