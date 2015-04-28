'use strict';

var EventEmitter = require('events').EventEmitter,
    log = function() {},
    emitter = null;

function init() {
  if(emitter) return;

  emitter = new EventEmitter();

  process.once('SIGINT', function() {
    log('on-exit: Recieved SIGINT');
    process.exit(130);
  });

  process.once('SIGTERM', function() {
    log('on-exit: Recieved SIGTERM');
    process.exit(143);
  });

  process.on('exit', function() {
    log('on-exit: Calling exit handlers')
    emitter.emit('exit');
  });
}

/**
 * var onExit = require('on-exit');
 * onExit(function() {
 *   // do cleanup
 * });
 */
module.exports = function(onExit) {
  init();
  emitter.once('exit', onExit);
};

/**
 * var onExit = require('on-exit').logger(console.log.bind(console));
 */
module.exports.logger = function(logger) {
  if(typeof logger !== 'function') throw new Error('onExit logger must be of type "function"');
  log = logger;
  init();
  return module.exports;
};
