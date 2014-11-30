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

var pifm = childProcess.spawn('ls', ['-l']);
var sox = childProcess.spawn('ls', ['-l']);

mopidy.on("event:trackPlaybackStarted", function (event) {
  // catch the uri
  var uri = event.tl_track.track.uri.split(":").pop();
  console.log("-----------------------------------");
  console.log("New song:");
  console.log(uri);

  // kill 
  pifm.kill();
  // sox.kill();


  // respawn
  // sox = childProcess.spawn("sox",["-t", "mp3", "/usr/share/jukebox/media/" + uri, "-t", "wav", "-r", "22050", "-"]);
  pifm = childProcess.spawn("/home/pi/PiFmRds/src/pi_fm_rds", ["-audio", "/usr/share/jukebox/media/" + uri]);

  // sox.stdout.on('data', function (data) {
  //   pifm.stdin.write(data);
  // });

  // sox.stderr.on('data', function (data) {
  //   console.log('sox stderr: ' + data);
  // });

  // sox.on('close', function (code) {
  //   if (code !== 0) {
  //     console.log('sox process exited with code ' + code);
  //   }
  //   pifm.stdin.end();
  // });

  pifm.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  pifm.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  pifm.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });

  // process.on('exit', function () {
  //     sox.kill();
  // });
  process.on('exit', function () {
      pifm.kill();
  });

}, logErrors);