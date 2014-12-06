'use strict';

var child_process = require('child_process');
var path = require('path');
var fs = require('fs');

// path is expected to be something like /home/pi/PiFmRds/src/pi_fm_rds (on a tinyfm vanilla install)
var pifmPath = process.env.PIFM_PATH || path.join('/', 'home', 'pi', 'PiFmRds', 'src', 'pi_fm_rds');
var activeStream;

module.exports = function(options){
  var resolvedOptions = options || {};
  var pipeline = resolveStreamer(resolvedOptions.env || process.env.NODE_ENV || null);

  return function streamFrom(filepath){
    clearStream(function(){
      var stream = fs.createReadStream(path.resolve(filepath));

      stream.pipe(pipeline.stdin);

      return stream;
    });
  };
};

function clearStream(fn){
  if (activeStream){
    activeStream.unpipe();

    activeStream.close(function(){
      activeStream = fn();
    });
  }
  else {
    process.nextTick(function(){
      activeStream = fn();
    });
  }
}

function resolveStreamer(env){
  var args = [];

  if (env !== 'production'){
    args = ['play', ['-']];
  }
  else {
    var pifmPath = require.resolve(pifmPath);

    args = [pifmPath, ["-audio", "-"]];
  }

  return child_process.spawn.apply(child_process, args);
}