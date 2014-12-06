#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var Mopidy = require('mopidy');
var encoder = require('../lib/encoder');

var argv = require('yargs')
  .options('initd-config', {
    alias: 'i',
    boolean: true,
    default: false,
    description: 'Displays out the related Debian initd script.'
  })
  .options('base-dir', {
    alias: 'd',
    default: '/usr/share/tinyfm',
    description: 'Base directory to resolve event media filepath from.'
  })
  .options('start', {
    boolean: true,
    default: false,
    description: 'Starts to media playback to FM broadcasting server.'
  })
  .strict()
  .argv;

if (argv.initdConfig) {
  return fs.createReadStream(path.join(__dirname, '..', 'dist', 'init.d', 'mpd2fm'))
    .pipe(process.stdout);
}

if (argv.start) {
  var mopidy = new Mopidy({
    callingConvention: 'by-position-or-by-name',
    webSocketUrl: 'ws://' + (process.env.HOST || 'localhost') + ':6680/mopidy/ws/'
  });

  var broadcast = encoder({ baseDir: argv.baseDir, env: 'test' });
  var currentStream;

  mopidy.on("event:trackPlaybackStarted", function (event) {
    // catch the uri
    var filepath = event.tl_track.track.uri.split(":").pop();
    console.log("-----------------------------------");
    console.log("New song:", filepath);

    currentStream = broadcast(filepath);
  }, logErrors);
}


function logErrors(err){
  console.error(err);
}
