'use strict';

var BaseComponent = require('./base-component.js');
var utils = require('./utils.js');

var Review = function(reviewData) {
  this.data = reviewData;
  this.authorImage = null;
  this.pictureLoadTimeout = null;

  BaseComponent.call(this, this.getReviewElement());

  this.reviewAuthorImage = this.element.querySelector('.review-author');
  this.reviewRating = this.element.querySelector('.review-rating');
  this.reviewText = this.element.querySelector('.review-text');
  this.quizAnswers = this.element.querySelectorAll('.review-quiz-answer');

  this.onAuthorImageLoad = this.onAuthorImageLoad.bind(this);
  this.onAuthorImageLoadAborted = this.onAuthorImageLoadAborted.bind(this);
  this.onReviewQuizAnswerClick = this.onReviewQuizAnswerClick.bind(this);
  this.onUsefulnessChange = this.onUsefulnessChange.bind(this);
};

utils.inherit(Review, BaseComponent);

Review.prototype.IMAGE_RAITING_WIDTH = 40;
Review.prototype.IMAGE_AUTHOR_WIDHT = 124;
Review.prototype.IMAGE_AUTHOR_HEIGHT = 124;
Review.prototype.IMAGE_LOAD_TIMEOUT = 10000;

Review.prototype.show = function(parentNode) {

  this.loadAuthorImage();

  this.reviewRating.style.width = (this.IMAGE_RAITING_WIDTH * this.data.getRating()) + 'px';

  this.reviewText.textContent = this.data.getDescription();

  Array.prototype.forEach.call(this.quizAnswers, function(item) {
    item.addEventListener('click', this.onReviewQuizAnswerClick);
  }, this);

  this.data.onUsefulnessChange = this.onUsefulnessChange;

  BaseComponent.prototype.show.call(this, parentNode);
};

Review.prototype.remove = function() {

  Array.prototype.forEach.call(this.quizAnswers, function(item) {
    item.removeEventListener('click', this.onReviewQuizAnswerClick);
  }, this);

  this.data.onUsefulnessChange = null;

  BaseComponent.prototype.remove.call(this);
};

Review.prototype.getReviewElement = function() {

  var template = document.querySelector('#review-template');

  var reviewToClone =
    template.content.querySelector('.review') || template.querySelector('.review');

  return reviewToClone.cloneNode(true);
};

Review.prototype.onAuthorImageLoad = function(evt) {

  clearTimeout(this.pictureLoadTimeout);

  this.reviewAuthorImage.width = this.IMAGE_AUTHOR_WIDHT;
  this.reviewAuthorImage.height = this.IMAGE_AUTHOR_HEIGHT;

  this.reviewAuthorImage.src = evt.target.src;

  this.reviewAuthorImage.alt = this.data.getAuthorName();
  this.reviewAuthorImage.title = this.data.getAuthorName();
};

Review.prototype.onAuthorImageLoadError = function() {
  this.element.classList.add('review-load-failure');
};

Review.prototype.onAuthorImageLoadAborted = function() {

  this.authorImage.src = '';
  this.element.classList.add('review-load-failure');
};

Review.prototype.loadAuthorImage = function() {

  this.authorImage = new Image(this.IMAGE_AUTHOR_WIDHT, this.IMAGE_AUTHOR_HEIGHT);

  this.authorImage.addEventListener('load', this.onAuthorImageLoad);
  this.authorImage.addEventListener('error', this.onAuthorImageLoadAborted);

  this.pictureLoadTimeout = setTimeout(this.onAuthorImageLoadAborted, this.IMAGE_LOAD_TIMEOUT);

  this.authorImage.src = this.data.getAuthorPicture();
};

Review.prototype.onReviewQuizAnswerClick = function(evt) {

  if (evt.target.classList.contains('review-quiz-answer-yes')) {
    this.data.upUsefulness();
  }

  if (evt.target.classList.contains('review-quiz-answer-no')) {
    this.data.downUsefulness();
  }
};

Review.prototype.onUsefulnessChange = function(sender, args) {

  Array.prototype.forEach.call(this.quizAnswers, function(item) {
    item.classList.remove('review-quiz-answer-active');
  });

  var quizAnswer = (args.isUseful)
    ? this.element.querySelector('.review-quiz-answer-yes')
    : this.element.querySelector('.review-quiz-answer-no');

  quizAnswer.classList.add('review-quiz-answer-active');
};

module.exports = Review;
