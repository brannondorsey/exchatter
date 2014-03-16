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


## Steps

For each word in this order (If a word matches in any step accept it and move on to the next word):

1. Onomatopoeia
2. Normalize use of 3+ letters (first to 2 and then 1)
3. Slang Misspellings & Acronyms (also run onomatopoeia results on slang misspellings to further normalize).
4. Slang Synonyms (using text_synonyms.csv)


## Regexes


Match positive emoticons

	/^[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}[\)\]bpPD>]$/

Match neutral emoticons
	
	/^[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}((\[\])|(\(\))|[oO])$/
	
Match negative emoticons
	
	/^[<=((=|)\[]?[:;8=BXx%][-^>*]{0,1}[XcC/\\(|\[[Ss?]$/
	
Match onomatopoeias

	aww
	/^a+w{2,}$/
	
	aw (or aaw)
	/^a{2,}w$/
	
	yay (or yyyyaaayyyy)
	/^y+a+y+$/
	
	hm (or hmm)
	/^hm+$/
	
	haha or hehe (or hahahahah or heheh)
	/^(he|ha){2,}/
	
	lol (or lololol)
	/^(lol){1,}(ol)*$/
	
Length turns to 5
hahah needs to become haha
	