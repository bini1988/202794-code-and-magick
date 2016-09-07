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

  function newObj() {};

  newObj.prototype = protoObj;

  return new newObj();
}

var utils = {
  throttle: throttle
};

module.exports = utils;
