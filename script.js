'use strict';

var Mopidy = require('mopidy');
var when = require('when');
var utils = require('util');

function logErrors(err){
  console.error(err);
}

var mopidy = new Mopidy({
  callingConvention: 'by-position-or-by-name',
  webSocketUrl: 'ws://' + (process.env.HOST || 'localhost') + ':6680/mopidy/ws/'
});

// mopidy.on(console.log.bind(console));

mopidy.on("event:trackPlaybackStarted", function (event) {
  console.log(event.tl_track.track.uri)
}, logErrors);

