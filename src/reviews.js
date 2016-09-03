'use strict';

var requestJSONP = require('./load.js');
var getReviewElement = require('./review.js');

var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsList = document.querySelector('.reviews-list');

var reviewsURL = 'http://localhost:1506/api/reviews';

requestJSONP(reviewsURL, function(reviews) {

  reviewsFilter.classList.add('invisible');

  reviews.forEach(function(item) {
    reviewsList.appendChild(getReviewElement(item));
  });

  reviewsFilter.classList.remove('invisible');
});
