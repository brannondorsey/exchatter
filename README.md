#Algorithm

This document contains the proposed algorithms and methods for generating personalized chatbots using a corpus consisting entirely of SMS messages and Facebook style chats. 

##Cosine Similarity

The first step in the algorithm is to take the user's input prompt and find the most similar messages from the corpus (ordered by `score`). Once similar messages are identified, hypothetically, a proper response can be determined using the responses from these similar questions.

```
Query (q)
"What time does your flight land?"

[1, 1, 1, 1, 1, 1]

Messages from corpus (m)

[1, 0, 0, 2, 0, 1]

```

__1.__ The number of unique words are ordered (alphabetically perhaps) in an array (representing that array's length) and the number of occurrences of each word are represented as the value of the array index. 

```
Query 
(q)
"What time does your flight land?" 
becomes 
[1, 1, 1, 1, 1, 1]

(q2)
"How did she do on the exam? I know she was worried" 
becomes
[1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1]
```
Notice that the second query has 12 words but an array length of only 11. That is because "she" is repeated once, indicated by the value at `q2[2]`.

 __2.__ Apply this Bag of Words algorithm to each message in the corpus using `q` and store the results in a 2D array of messages `m`. This time, add 1 at the end of each message representation in array `m` for __each word__ that message has that `q` does not.
 
First create an array for `m` messages (`m[0]` & `m[1]`) representing the number of occurrences of each unique word in `q`.
 
 ```
"What time does your flight land?"
 
(q)
 
 [1, 1, 1, 1, 1, 1]
 
(m)

"What your mom says shouldn't change your mind"
"Does the his plane land?"

 [
 	[1, 0, 0, 2, 0, 0]
 	[0, 0, 1, 0, 0, 1]
 ]
 
 
 ```
 
 Then account for all unique words that `m[0]` by adding to the end of the array. Do the same for `m[1]` (and all other elements in `m`).
 
```
"What time does your flight land?"

(q)

[1, 1, 1, 1, 1, 1]

(m)

"What your mom says shouldn't change your mind"
"Does his plane land?"

Notice: "+" operator used for concatenation in this example.

[
	[1, 0, 0, 2, 0, 0] + [1, 1, 1, 1, 1], <- representing "mom, says, shouldn't, change, mind"
	[0, 0, 1, 0, 0, 1] + [1, 1] <- representing "his, plane"
]

becomes 

(m)

[
	[1, 0, 0, 2, 0, 0, 1, 1, 1, 1, 1],
	[0, 0, 1, 0, 0, 1, 1, 1]
]


```
 
The two steps in __2.__ has been broken into separate steps for explanation however they can be accomplished at simultaneously in the program.

__3.__ Perform the _pythagorean theorem_ (`c = sqrt(a² + b²)`) on each array (varying multidimensional vector) element in `m` to find its euclidean length.


```
m[0] = [1, 0, 0, 2, 0, 0, 1, 1, 1, 1, 1]
m[1] = [0, 0, 1, 0, 0, 1, 1, 1]

Notice: 0s can be skipped because 0² = 0

Euclidean length (EL) of m[0] = sqrt(1² + 2² + 1² + 1² + 1² + 1²)
Euclidean length (EL) of m[1] = sqrt(1² + 1² + 1² + 1²)

EL of m[0] is 9
EL of m[1] is 4

```

__4.__ Normalize `q` and all children of `m` by dividing each array element by that array's `EL`.

```
Normalized Euclidean Length (NLE) of q is assumed to 
have already been calculated to be [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]

NLE m[0] = [1/9, 2/9, 1/9, 1/9, 1/9, 1/9, 1/9]
NLE m[1] = [1/4, 1/4, 1/4, 1/4]

```

__5.__ Calculate a similarity score (scalar) for each element in `m` (vector) in comparison to `q` (vector) by finding the dot product of each `score` = `⃗m` `⃗q`.

 
 
#Class Outlines

```
class Ex(phoneNumber, LoversPhoneNumber)

	properties:
		currentChat;
		corpus;
		loversDiscourse;
		otherDiscourse;
	
	methods:
		//adds to currentChat and uses below methods to output response
		getResponse(prompt) 		
		
		getIntroduction(prompt)
		getBooleanResponse(prompt)		
		getQuestion(prompt, chatTime //maybe length of chat affects this) 
		getFollowUpQuestion(prompt)
		
		getAvgResponseTime()
		getAvgMessageLength()
		getAvgReResponseRate()
		getOutlierChance()
		getInitiationChance()

```