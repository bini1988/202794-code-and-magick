'use strict';


var requestJSONP = function(url, callback) {

  window.JSONPCallback = function(data) {

    if (typeof callback === 'function') {
      callback(data);
    }
  };

  var scriptTag = document.createElement('script');

  scriptTag.src = url + '?callback=JSONPCallback';

  document.body.appendChild(scriptTag);

};

(function() {

  var reviewsURL = 'http://localhost:1506/api/reviews';

  requestJSONP(reviewsURL, function(data) {
    window.reviews = data;
  });

})();
