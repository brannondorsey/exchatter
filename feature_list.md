#Feature List

A list of unique features to use for classification and personalized text generation.

- Average and probability distribution (PD) (i.e. 10% x, 30% y, 60% z) response time.
- Average and PD re-response rate
- PD positive, negative, and neutral sentiment
- PD of one word, two word, three word, etc responses (possibly dependent on one word, two word, three word prompts etc)
- PD of one sentence, two sentence, and three sentence responses (possibly dependent on one sentence, two sentence, three sentence prompts etc)
- Ordered list of most used positive and most used negative 1 word responses
- Unigram, bigram, and trigram tables
- Average and PD word and sentence length of response (and maybe response time) for prompt of each word and sentence length
- Average and PD word length of each sentence
- Average and PD length and sentiment when prompt is positive
- Average and PD length and sentiment when prompt is negative
- Average and PD conversation length
- Average initiation rate
- Average no-response rate
- Chance to end a conversation (rather than conversation partner)
- List of messages that prompt an exact same response (along with a percent chance of occurrence based on each one... i.e. <3 receives a <3 response 13% of the time that <3 is the prompt)
- Hash table of most used words
- Hash table of most used proper nouns with the chance for each to appear in a response
- Chance to misspell
- PD of verb, noun, and adjective use
- Classification of prompt (question, short prompt, long prompt, etc...) that triggers a no-response
- Chance to say 9 vs 9PM vs 9pm vs 9 pm
- Chance to use multiple letters. I.e. "yesssss". (check if three of any letter exist in a row. If so document it and try to to identify the word (as yes). Then check how many times a user uses the word yes and create a probability of misssssspelling. Use that probability each time that user uses that word).
- Chance to ask a question. Chance to answer a question with a question.
- Percent of messages that use punctuation at the end of the sentence.
- Chance and PD to *correct a misspelling. (Use regular expression to check if response is one word and contains a "*").
- Create a model for most discussed subjects using topic detection
- Chance to use emoticons and emoji
- Chance to use the same words present in prompt in the response
- How sentiment depends on conversation length
- Most used conversation initiation and conversation ending messages
- Use of capitalization
- Tone
- Chance to use parenthesis, commas, and ellipses...