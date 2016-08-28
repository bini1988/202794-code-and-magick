'use strict';

var Game = require('./game.js');
var reviewForm = require('./form.js');
require('./reviews.js');


(function() {
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
})();
