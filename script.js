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
  var uri = urichunk[urichunk.length - 1];

  // kill 
  cmd.kill('SIGHUP');

  // respawn
  // var sox = childProcess.spawn("sox",["-t", "mp3", "/usr/share/jukebox/media/" + uri, "-t", "wav", "-"]);
  // var sox = childProcess.spawn("avconv", ["-i", "/usr/share/jukebox/media/" + uri, "-ac", "1", "-ar", "22050", "-b", "352k", "-f", "wav", "-"]);
  var pifm = childProcess.spawn("/home/pi/PiFmRds/src/pi_fm_rds", ["-audio", "-"]);

  sox.stdout.on('data', function (data) {
    pifm.stdin.write(data);
  });

  sox.stderr.on('data', function (data) {
    console.log('sox stderr: ' + data);
  });

  sox.on('close', function (code) {
    if (code !== 0) {
      console.log('sox process exited with code ' + code);
    }
    pifm.stdin.end();
  });
  
  pifm.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  pifm.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  pifm.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });

}, logErrors);