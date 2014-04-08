var MessageObjGenerator = require('./MessageObjectGenerator'),
_ = require('underscore')._,
moment = require('moment'),
util = require('util'),
_fs = require('fs');

var _messageObjGenerator = new MessageObjGenerator();

function PersonalCorpus(filename, callback) {

	if (!_.isUndefined(filename)){
		this.filename = filename;
		this.load(filename, callback);
	}
}

PersonalCorpus.prototype.eachMessage = function(fn) {

	_.each(this.corpus, function(messagesWithPerson) {
		_.each(messagesWithPerson.messages, function(messageObj){
			fn(messageObj);
		});
	});
}

PersonalCorpus.prototype.generateFromRaw = function(filename, type, callback) {
	
	var self = this;
	_fs.readFile(filename, function(err, data){

		if (err) throw err;
		var rawMessageObjs = JSON.parse(data);

		switch (type.toLowerCase()) {

			case "iphone":

				var onMessagesGenerated = _.after(rawMessageObjs.length, function(messageObjs){
					self.corpus = self._generateCorpusFromMessageObjs(messageObjs);
					callback(self.corpus);
				});

				var messageObjs = [];

				_.each(rawMessageObjs, function(rawMessageObjs){
					
					var config = {
						source: "personal",
						to: rawMessageObjs.to,
						from: rawMessageObjs.from,
						timestamp: rawMessageObjs.date,
						text: rawMessageObjs.text	
					};

					_messageObjGenerator.getMessageObject(config, function(messageObj){
						messageObjs.push(messageObj);
						onMessagesGenerated(messageObjs);
					});
				});

			break;
		}
	});
}

PersonalCorpus.prototype.load = function(filename, callback) {
	
	var self = this;
	_fs.readFile(filename, 'utf-8', function(err, data){
		if (err) throw err;
		self.corpus = JSON.parse(data);
		var messages = [];
		_.each(self.corpus, function(person){
			messages = messages.concat(person.messages);
		});
		self.messages = messages;
		callback(self.corpus);
	});
	
}

PersonalCorpus.prototype.save = function(filename, callback) {

	_fs.writeFile(filename, JSON.stringify(this.corpus), function (err) {
	  if (err) throw err;
	  callback();
	});
}

PersonalCorpus.prototype._generateCorpusFromMessageObjs = function(messageObjs) {
		
		var numbers = [];
		// var messagesByNumber = [];
		var corpus = [];
		// messageObjs = _.sortBy(messageObjs, function(obj){ return moment(obj.timestamp).valueOf() });
		
		_.each(messageObjs, function(messageObj){
			if (numbers.indexOf(messageObj.to) == -1) numbers.push(messageObj.to);
			if (numbers.indexOf(messageObj.from) == -1) numbers.push(messageObj.from);
		});
		
		// _.each(messageObjs, function(messageObj){
		// 	var toIndex = numbers.indexOf(messageObj.to);
		// 	var fromIndex = numbers.indexOf(messageObj.to);
		// 	if (toIndex != -1) {
		// 		if (_.isUndefined(messagesByNumber[toIndex])) messagesByNumber[toIndex] = [];
		// 		messagesByNumber[toIndex].push(messageObj);
		// 	} else if (fromIndex != -1) {
		// 		if (_.isUndefined(messagesByNumber[fromIndex])) messagesByNumber[fromIndex] = [];
		// 		messagesByNumber[fromIndex].push(messageObj);
		// 	}
		// });
		
		numbers = _.without(numbers, "Me");
		_.each(numbers, function(number){

			var messages = _.filter(messageObjs, function(messageObj){
				return messageObj.to == number || messageObj.from == number;
			});

			corpus.push({
				number: number,
				messages: messages
			});
		});
	
		
		// _.each(messagesByNumber, function(message, i){
		// 	corpus.push({
		// 		number: numbers[i],
		// 		messages: messagesByNumber[i]
		// 	});
		// });

		corpus = _.sortBy(corpus, function(corpus){
			return - corpus.messages.length;
		});

		return corpus;
}

module.exports = exports = PersonalCorpus;
