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

    console.warn('Ошибка при попытке обращения к ресурсу ' + url);
  };

  xhr.timeout = 10000;

  xhr.ontimeout = function() {

    console.warn('Обращение к ресурсу ' + url + '. Нет ответа от сервера.');
  };

  xhr.open('GET', url);

  xhr.send();
};
