/*
	New test that does a neighbor match to
	match an input with a similar message and output the next
	message from the corpus to the console. This test uses 
	the Message object and runs similarity on normalized text.
	No text generation is done at this point.
 */

var SimilarityMatcher = require(__dirname + '/../src/classes/SimilarityMatcher'),
MessageObjectGenerator = require(__dirname + '/../src/classes/MessageObjectGenerator'),
PersonalCorpus = require( __dirname + '/../src/classes/PersonalCorpus'),
Cleverbot = require('cleverbot-node'),
Eliza = require('./ElizaBot'),
config = require('./config'),
twilioClient = require('twilio')(config.accountSid, config.authToken),
express = require('express'),
moment = require('moment'),
_ = require('underscore'),
argv = require('argv'),
fs = require('fs');

var app = express();
var server;
var rateModel;
var numbers = [];


var args = argv.option([{
	   
	    name: 'person',
	    short: 'p',
	    type: 'string',
	    description: 'Defines the corpus folder to use in "data/corpuses/" to use',
	    example: "'script --person=value' or 'script -p value'"
	}]).run().options;

var messageObjGenerator = new MessageObjectGenerator();
var similarityMatcher = new SimilarityMatcher();
var cleverbot = new Cleverbot();
var eliza = new Eliza();
var personalCorpus;

if (!_.isUndefined(args.person)) {
	
	fs.readFile(__dirname + '/data/rate_model.json', 'utf-8', function(err, data){ 
		if (err) throw err;
	    rateModel = JSON.parse(data);
	    app.use(express.urlencoded());
	    app.post('/cleverbot', function(req, res){

		    var timeFormat = "YYYY/MM/DD HH:mm:ss";
		    var timestamp = moment().format(timeFormat);
		    if (!_.isUndefined(getQueryParam("To", req)) &&
		        !_.isUndefined(getQueryParam("From", req)) &&
		        !_.isUndefined(getQueryParam("Body", req))){

		        console.log();
		        console.log(timestamp);
		        console.log("To: " + getQueryParam("To", req));
		        console.log("From: " + getQueryParam("From", req));
		        console.log("Text: \"" + getQueryParam("Body", req) + "\"");
		        text(getQueryParam("Body", req), getQueryParam("From", req));  
	        }

		    res.send("Post ping recieved at " + timestamp);
	    });

	    app.get("/", function(req, res) {
	      res.send("Twilio-exechatter is running! Text " + config.twilioNumber + " to chat.");
	    });

	    server = app.listen(config.port, function() {
	        console.log('Listening on port %d', server.address().port);
	        personalCorpus = new PersonalCorpus(__dirname + '/../data/corpuses/' + args.person + '/corpus.json', function(corpus){
	        	console.log("Exchatter is ready...");
			});
	    });
	});
} else {
	argv.help();
	process.exit(0);
}

function text(message, phoneNumber) {

	if (_.indexOf(numbers, phoneNumber) == -1) {
	    numbers.push(phoneNumber);
    }
 
	messageObjGenerator.getMessageObject({
		source: "string",
		to: "Exchatter",
		from: phoneNumber,
		timestamp: "string",
		text: message
	}, function(messageObj){

		var similarResults = similarityMatcher.getSimilar(messageObj, "Me", personalCorpus);
		if (similarResults.length > 0) {
			var similar = _.sample(similarResults);
			var response = similarityMatcher.getNearestResponse(similar.message, personalCorpus);
			sendMessage(response.text, phoneNumber);
		} else {
			console.log("No response found in personal corpus. Using Cleverbot...");
			cleverbot.write(messageObj.text, function(response){
				
				if (response.message == "<html>") {
					console.log("Cleverbot API is down. Using Eliza...");
			        if (_.indexOf(numbers, phoneNumber) == -1) {
			          console.log("NEW NUMBER")
			          response.message = eliza.getInitial();
			          numbers.push(phoneNumber);
			        } else {
			         response.message = eliza.transform(message);
			        }
			    }

				sendMessage(response.message, phoneNumber);
			});
		}
	});
}

function sendMessage(text, phoneNumber) {
	var timeout = _.sample(rateModel) * 1000 * 60;
	console.log("Will respond with: \"" + text + "\" in " + (timeout / 1000 / 60) + " minutes.");
	setTimeout( function(){
	  twilioClient.sendMessage({
				to: phoneNumber,  
				from: config.twilioNumber,
				body: text,    
			}, function(err, message) {
				if (err) throw err;
				console.log("Sent to " + phoneNumber + ": " + text); 
			});
	}, timeout);
}

function getQueryParam(name, req) {
    return req.body[name];
}
