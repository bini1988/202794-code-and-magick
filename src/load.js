'use strict';

var CALLBACK_FUNCTION_NAME = 'JSONPCallback';

module.exports = function(url, callback) {

  window[CALLBACK_FUNCTION_NAME] = function(data) {

    if (typeof callback === 'function') {
      callback(data);
    }
  };

  var scriptTag = document.createElement('script');

  scriptTag.src = url + '?callback=' + CALLBACK_FUNCTION_NAME;

  document.body.appendChild(scriptTag);
};
