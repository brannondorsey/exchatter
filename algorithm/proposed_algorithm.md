#Exchatter Proposed Algorithm

##Overview

(`$`) notates a score session.

1. (a) Use Cosine Similarity (and related algorithms) to find similar questions asked to the ex from the corpus (ignore if from ex-ex for this step). (`$`) if results score high enough save them as `a`. If not skip the rest and go to the [backup plan](#cleverbot-backup-plan).
(b) Identify `target` response type using sentiment analysis and other NLP things.
2. Match each `a` with the corresponding ex's response. (`$`) Value ex-ex responses greater than ex-anyone responses. Save this as `b`.
3. (`$`) Match `b` against `target` sentence structure. If they this score is high enough (or maybe the overall score?) then output the answer. If not run the [backup plan](#cleverbot-backup-plan) on original input.

Maybe run every subsequent step on the top 5+ results of each current step to increase the chance that the overall results will have a real winner. Maybe rank the ones that have had high scores at each step more?

###Cleverbot backup plan

1. Pass user input directly to Cleverbot using [cleverbot-node](https://github.com/fojas/cleverbot-node/blob/master/lib/cleverbot.js). Make 9+ requests to get lots of answers to work with.
2. run similarity algorithm on all of them compared to corpus. (`$`) Value ex-ex responses greater than ex-anyone responses. Save these as `b`. This is basically step 2 of the main algorithm.
3. (`$`)If the best `b` is greater than a certain score then output. Else output the best vanilla Cleverbot response.

###Misc
- How can the collective messages from the entire chat play a role?
- How do I handle re-responses?
