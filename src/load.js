'use strict';

module.exports = function(url, options, callback) {

  var xhr = new XMLHttpRequest();

  if (options) {
    url += options;
  }

  xhr.onload = function(evt) {

    var loadedData = JSON.parse(evt.target.response);

    callback(loadedData);
  };

  xhr.onerror = function() {

    console.warn('Ошибка при попытке доступа к ресурсу ' + url);
  };

  xhr.ontimeout = function() {

    console.warn('Ошибка при попытке доступа к ресурсу ' + url + '. Превышен интервал ожидания.');
  };

  xhr.open('GET', url);

  xhr.timeout = 10000;

  xhr.send();
};
