'use strict';

/*
 This test case demonstrates our ability to swap a stream with another one.

 $ node bin/test.js audioFile1.wav audioFile2.wav

 It will play an audio file and swap with a second audio file a second later.
 */

var broadcast = require('../lib/encoder')({ env: 'test' });

broadcast(process.argv[2]);

setTimeout(function(){
  broadcast(process.argv[3])
}, 1000);