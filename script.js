'use strict';

var childProcess = require('child_process');
var Mopidy = require('mopidy');

function logErrors(err){
  console.error(err);
}

var mopidy = new Mopidy({
  callingConvention: 'by-position-or-by-name',
  webSocketUrl: 'ws://' + (process.env.HOST || 'localhost') + ':6680/mopidy/ws/'
});

// mopidy.on(console.log.bind(console));

var cmd = childProcess.spawn('ls', ['-l']);

mopidy.on("event:trackPlaybackStarted", function (event) {
  // catch the uri
  console.log("New song:");
  var urichunk = event.tl_track.track.uri.split(":");
  var uri = urichunk[len(urichunk-1)];
  console.log(uri);

  // kill 
  cmd.kill('SIGHUP');

  // respawn
  command = "sox -t mp3 /usr/share/jukebox/media/" + uri + " -t wav - | ~/PiFmRds/src/pi_fm_rds -audio -";
  console.log(command);
  cmd = childProcess.spawn(command);
  
  cmd.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  cmd.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  cmd.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });

}, logErrors);

