'use strict';

require('./reviews.js');

var Game = require('./game.js');
var Gallery = require('./gallery.js');

var reviewForm = require('./form.js');
var utils = require('./utils.js');

var DEFAULT_THROTTLE_DELAY = 100;

function isVisibleElement(element) {
  return element.getBoundingClientRect().bottom >= 0;
}

var demoElement = document.querySelector('.demo');

var game = new Game(demoElement);

game.initializeLevelAndStart();
game.setGameStatus(Game.Verdict.INTRO);

function demoScrollHandler() {
  if (!isVisibleElement(demoElement)) {
    game.setGameStatus(Game.Verdict.PAUSE);
  }
}

var optimizedDemoScrollHandler = utils.throttle(demoScrollHandler, DEFAULT_THROTTLE_DELAY);

window.addEventListener('scroll', optimizedDemoScrollHandler);

/**
  * Форма отзыва
  */

var formOpenButton = document.querySelector('.reviews-controls-new');

/** @param {MouseEvent} evt */
formOpenButton.onclick = function(evt) {
  evt.preventDefault();

  reviewForm.open(function() {
    game.setGameStatus(Game.Verdict.PAUSE);
    game.setDeactivated(true);
  });
};

reviewForm.onClose = function() {
  game.setDeactivated(false);
};


/**
  * Галерея скриншотов
  */

var galleryImages = document.querySelectorAll('.photogallery .photogallery-image img');

var galleryImagesSrc = Array.prototype.map.call(galleryImages, function(item) {
  return item.src;
});

var gallery = new Gallery(galleryImagesSrc);

var galleryImageRefs = document.querySelectorAll('.photogallery .photogallery-image');

Array.prototype.forEach.call(galleryImageRefs, function(item, index) {
  item.addEventListener('click', function() {
    gallery.show(index);
  });
});

/**
  * Эффект параллакса
  */

var headerClouds = document.querySelector('.header-clouds');

function cloudsMoveScrollHandler() {

  var doc = document.documentElement;
  var scrollPos = (window.pageYOffset || doc.scrollTop);

  headerClouds.style.backgroundPosition = scrollPos + 'px';
}

function cloudsVisibleScrollHandler() {
  if (isVisibleElement(headerClouds)) {
    window.addEventListener('scroll', cloudsMoveScrollHandler);
  } else {
    window.removeEventListener('scroll', cloudsMoveScrollHandler);
  }
}

var optimizedCloudsVisibleScrollHandler = utils.throttle(cloudsVisibleScrollHandler, DEFAULT_THROTTLE_DELAY);

window.addEventListener('scroll', cloudsMoveScrollHandler);
window.addEventListener('scroll', optimizedCloudsVisibleScrollHandler);
