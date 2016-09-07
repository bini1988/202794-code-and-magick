'use strict';

var BaseComponent = require('./base-component.js');
var utils = require('./utils.js');

var Review = function(data) {
  this.data = data;
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
};

utils.inherit(Review, BaseComponent);

Review.prototype.IMAGE_RAITING_WIDTH = 40;
Review.prototype.IMAGE_AUTHOR_WIDHT = 124;
Review.prototype.IMAGE_AUTHOR_HEIGHT = 124;
Review.prototype.IMAGE_LOAD_TIMEOUT = 10000;

Review.prototype.show = function(parentNode) {

  this.loadAuthorImage();

  this.reviewRating.style.width = (this.IMAGE_RAITING_WIDTH * this.data.rating) + 'px';

  this.reviewText.textContent = this.data.description;

  Array.prototype.forEach.call(this.quizAnswers, function(item) {
    item.addEventListener('click', this.onReviewQuizAnswerClick);
  }, this);

  BaseComponent.prototype.show.call(this, parentNode);
};

Review.prototype.remove = function() {

  Array.prototype.forEach.call(this.quizAnswers, function(item) {
    item.removeEventListener('click', this.onReviewQuizAnswerClick);
  }, this);

  BaseComponent.prototype.remote.call(this);
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

  this.reviewAuthorImage.alt = this.data.author.name;
  this.reviewAuthorImage.title = this.data.author.name;
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

  this.authorImage.src = this.data.author.picture;
};

Review.prototype.onReviewQuizAnswerClick = function(evt) {

  Array.prototype.forEach.call(this.quizAnswers, function(item) {
    item.classList.remove('review-quiz-answer-active');
  });

  evt.target.classList.add('review-quiz-answer-active');
};

module.exports = Review;
