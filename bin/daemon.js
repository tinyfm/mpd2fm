#!/usb/bin/env node

'use strict';

var Mopidy = require('mopidy');
var mopidy = new Mopidy({
  callingConvention: 'by-position-or-by-name',
  webSocketUrl: 'ws://' + (process.env.HOST || 'localhost') + ':6680/mopidy/ws/'
});

var broadcast = require('../lib/encoder')({ env: 'test' });
var currentStream;

mopidy.on("event:trackPlaybackStarted", function (event) {
  // catch the uri
  var filepath = event.tl_track.track.uri.split(":").pop();
  console.log("-----------------------------------");
  console.log("New song:", uri);

  currentStream = broadcast(filepath);
}, logErrors);

function logErrors(err){
  console.error(err);
}
