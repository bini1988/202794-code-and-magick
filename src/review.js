'use strict';

module.exports = function(data, container) {

  var IMAGE_LOAD_TIMEOUT = 10000;
  var IMAGE_AUTHOR_WIDHT = 124;
  var IMAGE_AUTHOR_HEIGHT = 124;
  var IMAGE_RAITING_WIDTH = 40;

  var reviewTemplate = document.querySelector('#review-template');

  var reviewToClone = ('content' in reviewTemplate) ?
    reviewTemplate.content.querySelector('.review') : reviewTemplate.querySelector('.review');

  var reviewItem = reviewToClone.cloneNode(true);
  var reviewAuthor = reviewItem.querySelector('.review-author');
  var reviewRating = reviewItem.querySelector('.review-rating');
  var reviewText = reviewItem.querySelector('.review-text');

  var authorPicture = new Image(IMAGE_AUTHOR_WIDHT, IMAGE_AUTHOR_HEIGHT);
  var pictureLoadTimeout;

  authorPicture.onload = function(evt) {
    clearTimeout(pictureLoadTimeout);
    reviewAuthor.width = IMAGE_AUTHOR_WIDHT;
    reviewAuthor.height = IMAGE_AUTHOR_HEIGHT;
    reviewAuthor.src = evt.target.src;
    reviewAuthor.alt = data.author.name;
    reviewAuthor.title = data.author.name;
  };

  authorPicture.onerror = function() {
    reviewItem.classList.add('review-load-failure');
  };

  pictureLoadTimeout = setTimeout(function() {
    authorPicture.src = '';
    reviewItem.classList.add('review-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  authorPicture.src = data.author.picture;

  reviewRating.style.width = (IMAGE_RAITING_WIDTH * data.rating) + 'px';

  reviewText.textContent = data.description;

  container.appendChild(reviewItem);

  return reviewItem;
};
