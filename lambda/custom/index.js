'use strict';

var Alexa = require('alexa-sdk');

var records = [
  { artist : 'Die Prinzen',
    songurl : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Die+Prinzen+-+Backstagepass+Ins+Himmelreich.mp3'
  },
  { artist : 'Eagles',
    songurl : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Eagles+-+Hotel+California.mp3'
  },
  { artist : 'Leslie Cheung' ,
    songurl : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Leslie+Cheung+-+American+Pie.mp3'
  },
  { artist : 'Yael Naim',
    songurl : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Yael+Naim+-+Go+To+The+River.mp3'
  },
  { artist : 'Yael Naim',
    songurl : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Yael+Naim+-+Far+Far.mp3'
  },
  { artist : 'Ohashi Trio',
    songurl : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Ohashi+Trio+-+Wa+Su+Re+Nai.mp3'
  },
  { artist : 'Ohashi Trio',
    songurl : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Ohashi+Trio+-+Gravity.mp3'
  }
]

var selectSong = function(){
  var rand = Math.ceil(Math.random() * records.length) - 1;
  var url = records[rand]["songurl"];
  return url;
}

var streamInfo = {
  title: 'Small Music Box',
  subtitle: "A small music box for Science Hack Day",
  cardContent: "Get more details at: https://skilltemplates.com",
  // url : 'https://s3-eu-west-1.amazonaws.com/small-music-box/Eagles+-+Hotel+California.mp3',
  url : selectSong(),
  image: {
    largeImageUrl: 'https://s3.amazonaws.com/cdn.dabblelab.com/img/alexa-card-lg.png',
    smallImageUrl: 'https://s3.amazonaws.com/cdn.dabblelab.com/img/alexa-card-sm.png'
  }
};



exports.handler = (event, context, callback) => {
  var alexa = Alexa.handler(event, context, callback);

  alexa.registerHandlers(
    handlers,
    audioEventHandlers
  );

  alexa.execute();
};

var handlers = {
  'LaunchRequest': function() {
    this.emit('PlayStream');
  },
  'PlayStream': function() {
    this.response.speak('Quack quack for Science Hack Day.').audioPlayerPlay('REPLACE_ALL', streamInfo.url, streamInfo.url, null, 0);
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function() {
    // skill help logic goes here
    this.emit(':responseReady');
  },
  'SessionEndedRequest': function() {
    // no session ended logic needed
  },
  'ExceptionEncountered': function() {
    console.log("\n---------- ERROR ----------");
    console.log("\n" + JSON.stringify(this.event.request, null, 2));
    this.callback(null, null)
  },
  'Unhandled': function() {
    this.response.speak('Sorry. Something went wrong.');
    this.emit(':responseReady');
  },
  'AMAZON.NextIntent': function() {
    this.response.speak('This skill does not support skipping.');
    this.emit(':responseReady');
  },
  'AMAZON.PreviousIntent': function() {
    this.response.speak('This skill does not support skipping.');
    this.emit(':responseReady');
  },
  'AMAZON.PauseIntent': function() {
    this.emit('AMAZON.StopIntent');
  },
  'AMAZON.CancelIntent': function() {
    this.emit('AMAZON.StopIntent');
  },
  'AMAZON.StopIntent': function() {
    this.response.speak('Okay. I\'ve stopped the stream.').audioPlayerStop();
    this.emit(':responseReady');
  },
  'AMAZON.ResumeIntent': function() {
    this.emit('PlayStream');
  },
  'AMAZON.LoopOnIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  'AMAZON.LoopOffIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  'AMAZON.ShuffleOnIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  'AMAZON.ShuffleOffIntent': function() {
    this.emit('AMAZON.StartOverIntent');
  },
  'AMAZON.StartOverIntent': function() {
    this.response.speak('Sorry. I can\'t do that yet.');
    this.emit(':responseReady');
  },
  'PlayCommandIssued': function() {

    if (this.event.request.type === 'IntentRequest' || this.event.request.type === 'LaunchRequest') {
      var cardTitle = streamInfo.subtitle;
      var cardContent = streamInfo.cardContent;
      var cardImage = streamInfo.image;
      this.response.cardRenderer(cardTitle, cardContent, cardImage);
    }

    this.response.speak('Enjoy.').audioPlayerPlay('REPLACE_ALL', streamInfo.url, streamInfo.url, null, 0);
    this.emit(':responseReady');
  },
  'PauseCommandIssued': function() {
    this.emit('AMAZON.StopIntent');
  }
}

var audioEventHandlers = {
  'PlaybackStarted': function() {
    this.emit(':responseReady');
  },
  'PlaybackFinished': function() {
    this.emit(':responseReady');
  },
  'PlaybackStopped': function() {
    this.emit(':responseReady');
  },
  'PlaybackNearlyFinished': function() {
    this.response.audioPlayerPlay('REPLACE_ALL', streamInfo.url, streamInfo.url, null, 0);
    this.emit(':responseReady');
  },
  'PlaybackFailed': function() {
    this.response.audioPlayerClearQueue('CLEAR_ENQUEUED');
    this.emit(':responseReady');
  }
}
