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

  var reviewsFilter = document.querySelector('.reviews-filter');
  var reviewsList = document.querySelector('.reviews-list');
  var reviewTemplate = document.querySelector('#review-template');

  var reviewToClone = ('content' in reviewTemplate) ?
    reviewTemplate.content.querySelector('.review') : reviewTemplate.querySelector('.review');

  var reviewsURL = 'http://localhost:1506/api/reviews';

  var IMAGE_LOAD_TIMEOUT = 10000;

  var getReviewElement = function(data, container) {

    var reviewItem = reviewToClone.cloneNode(true);
    var reviewAuthor = reviewItem.querySelector('.review-author');
    var reviewRating = reviewItem.querySelector('.review-rating');

    var authorPicture = new Image(124, 124);
    var pictureLoadTimeout;

    authorPicture.onload = function(evt) {
      clearTimeout(pictureLoadTimeout);
      reviewAuthor.width = 124;
      reviewAuthor.height = 124;
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

    reviewRating.style.width = (40 * data.rating) + 'px';

    reviewItem.querySelector('.review-text').textContent = data.description;

    container.appendChild(reviewItem);

    return reviewItem;
  };

  requestJSONP(reviewsURL, function(reviews) {

    reviewsFilter.classList.add('invisible');

    reviews.forEach(function(item) {
      getReviewElement(item, reviewsList);
    });

    reviewsFilter.classList.remove('invisible');

  });

})();
