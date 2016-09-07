'use strict';

function throttle(callback, timeout) {

  var isExecutable = true;

  return function(args) {
    if (isExecutable) {

      callback(args);

      isExecutable = false;

      setTimeout(function() {
        isExecutable = true;
      }, timeout);
    }
  };
}

function inherit(protoObj) {

  function NewObj() {}

  NewObj.prototype = protoObj;

  return new NewObj();
}

var utils = {
  throttle: throttle
};

module.exports = utils;
