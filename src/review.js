'use strict';

var Review = function(data) {

  this.IMAGE_RAITING_WIDTH = 40;
  this.IMAGE_AUTHOR_WIDHT = 124;
  this.IMAGE_AUTHOR_HEIGHT = 124;

  this.data = data;

  this.element = this.getReviewElement();

  this.reviewAuthor = this.element.querySelector('.review-author');
  this.reviewRating = this.element.querySelector('.review-rating');
  this.reviewText = this.element.querySelector('.review-text');

  this.authorPicture = null;
  this.pictureLoadTimeout = null;
  this.onAuthorPictureLoad = this.onAuthorPictureLoad.bind(this);
  this.onAuthorPictureLoadError = this.onAuthorPictureLoadError.bind(this);
  this.onAuthorPictureLoadTimeout = this.onAuthorPictureLoadTimeout.bind(this);
  this.loadAuthorPicture();

  this.reviewRating.style.width = (this.IMAGE_RAITING_WIDTH * this.data.rating) + 'px';
  this.reviewText.textContent = this.data.description;

  this.quizAnswers = this.element.querySelectorAll('.review-quiz-answer');
  this.onReviewQuizAnswerClick = this.onReviewQuizAnswerClick.bind(this);

  for(var i = 0; i < this.quizAnswers.length; i++) {
    this.quizAnswers[i].addEventListener('click', this.onReviewQuizAnswerClick);
  }
};

Review.prototype.getReviewElement = function() {

  var reviewTemplate = document.querySelector('#review-template');

  var reviewToClone =
    reviewTemplate.content.querySelector('.review') || reviewTemplate.querySelector('.review');

  return reviewToClone.cloneNode(true);
};

Review.prototype.onAuthorPictureLoad = function(evt) {

  clearTimeout(this.pictureLoadTimeout);

  this.reviewAuthor.width = this.IMAGE_AUTHOR_WIDHT;
  this.reviewAuthor.height = this.IMAGE_AUTHOR_HEIGHT;
  this.reviewAuthor.src = evt.target.src;
  this.reviewAuthor.alt = this.data.author.name;
  this.reviewAuthor.title = this.data.author.name;
};

Review.prototype.onAuthorPictureLoadError = function() {

  this.element.classList.add('review-load-failure');
};

Review.prototype.onAuthorPictureLoadTimeout = function() {
  this.authorPicture.src = '';
  this.element.classList.add('review-load-failure');
};


Review.prototype.loadAuthorPicture = function() {

  var IMAGE_LOAD_TIMEOUT = 10000;

  this.authorPicture = new Image(this.IMAGE_AUTHOR_WIDHT, this.IMAGE_AUTHOR_HEIGHT);

  this.authorPicture.addEventListener('load', this.onAuthorPictureLoad);

  this.authorPicture.addEventListener('error', this.onAuthorPictureLoadError);

  this.pictureLoadTimeout = setTimeout(this.onAuthorPictureLoadTimeout, IMAGE_LOAD_TIMEOUT);

  this.authorPicture.src = this.data.author.picture;
};

Review.prototype.remove = function() {

  for(var i = 0; i < this.quizAnswers.length; i++) {
    this.quizAnswers[i].removeEventListener('click', this.onReviewQuizAnswerClick);
  }

  this.element.parentNode.removeChild(this.element);
};

Review.prototype.onReviewQuizAnswerClick = function(evt) {

  Array.prototype.forEach.call(this.quizAnswers, function(item) {
    item.classList.remove('review-quiz-answer-active');
  });

  evt.target.classList.add('review-quiz-answer-active');
};

module.exports = Review;
