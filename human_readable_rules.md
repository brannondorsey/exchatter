#Human Readable rules & ideas

- Respond to 1 sentence prompts with 1 sentence answers. 2 sentence prompts with 2 sentence answers, etc...
- Initiate with human using the first text message in a new conversation
- Respond to questions with answers
- Don't respond to an active conversation using a message that started or ended a conversation. Instead Identify Head and Tail of conversation and use them accordingly.
- When should the bot respond with the exact same thing? <3 for instance.
- Figure in the score of a Markov or Graph that represents the probability of a response length based on the length of the prompt message. This is based on each user. For instance, one person might respond to a 4 word message with 6 words 30% of the time, 4 words 20% of the time, 3 words 10% etc... How does that score play in?
- Use slots: Did you see ____? <-- Noun that can be switched out i.e. [the giants, the matrix, bob].
- Use previous conversation flow as model for current conversation.
- .3 Cosine Similarity and .7 Levenshtein distance for finding similar prompts.
- Create an algorithm that analyzes a corpus of messages from one person and breaks it into conversation chunks by analyzing timestamps.
- Hash table of most used words
- Use interests to gather add-on corpuses of data
- Use a lexicon for Slot method. For instance "I ate at __Bluebell__ in __San Francisco__" could appear to a computer as "I ate at __a restaurant__ in __a city__".
- Bot should make periodic typing errors dependent on how often the ex makes mistakes (this can be found by writing a regular expression that searches 1 word responses that contain a '*'). Bots can then correct themselves.
- If someone says “you [something]” then bot should be liable to spit it back changing the “you” to an “I” and even changing the verb form of the verb “to be” and the case of the object, and prefacing it with a short question. (taken from [Turing Test, etc.](www.gigamonkeys.com/resume/turing.html))

##Things to think about
- __Start using CouchDB soon!__ Get a feel for it so that I can figure out how to best approach using it for machine learning. Im thinking that all training processes will be run on the each corpus and the results (graphs, probabilities, etc...) will be saved in a document that includes the corpus itself. That way calculations at runtime will be kept to a minimum.
- Come up with a document model
- __More data!__ Even for testing I need to get SMS data from someone other than myself.
- Create a system for annotation. Probably browser based... That way I can get results based on each algorithmic revision.
- Where do I get sample question/discourse data to run auto chats for transcript purposes. Preferably data that reflects a similar context to that which would be reflective of the kinds of interactions that users will have with an exchatter on http://myex.es.
- How can the collective messages from the entire chat play a role?

##Testing Data
- Create a list of 50 easy (common), medium (uncommon), and hard (rare) example prompts/questions.
- Test each and save the results as a `json` array (perhaps in a database).
- Render those results to a browser in a way that they can be easily boolean annotated.
- Record the results for each annotation.


##Security & Privacy

- Replace names, phone numbers, and addresses.
- Maybe I could use regular expressions for addresses.
