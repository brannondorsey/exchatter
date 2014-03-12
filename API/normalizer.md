# Normalizer API

Here lives the proposed `Normalizer` class. It has methods for normalizing a text message string.

Here is a list of situations that it should be able to handle:



	#tagAnything

	If first word is misspelled, check if last letter is 's' 
	"dawg" vs "dawgs"
	
	"sheeeeiiit"
	For 3+ letter instances revert to two letters, check again, and then check again with one letter
	
	"this/that" 
	Break apart and pick one
	
	"5ish"
	
	"yes vs yez"
	
	"blowin vs blowing" <-- don't require s when verbing
	Present Participle / Gerund
	
	Should I replace personal nouns etc in normalized with **PERSON**, or **PLACE**?