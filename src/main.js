'use strict';

require('./reviews.js');

var Game = require('./game.js');
var Gallery = require('./gallery.js');
var reviewForm = require('./form.js');


var game = new Game(document.querySelector('.demo'));

game.initializeLevelAndStart();
game.setGameStatus(Game.Verdict.INTRO);

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
  * Галерея скринщотов
  */

var galleryImages = document.querySelectorAll('.photogallery .photogallery-image img');
var galleryImagesSrc = [];

for(var i = 0; i < galleryImages.length; i++) {
  galleryImagesSrc.push(galleryImages[i].src);
}

var gallery = new Gallery(galleryImagesSrc);

var galleryImageRefs = document.querySelectorAll('.photogallery .photogallery-image');

for(var j = 0; j < galleryImageRefs.length; j++) {

  var galleryImageOnClickHandler = function handler() {
    gallery.show(handler.imageIndex);
  };

  galleryImageOnClickHandler.imageIndex = j;

  galleryImageRefs[j].onclick = galleryImageOnClickHandler;
}
