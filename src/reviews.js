'use strict';

var Review = require('./review.js');

var requestJSONP = require('./load.js');


var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsList = document.querySelector('.reviews-list');
var reviewsArr = [];

var reviewsURL = 'http://localhost:1506/api/reviews';

requestJSONP(reviewsURL, function(reviews) {

  reviewsFilter.classList.add('invisible');

  reviews.forEach(function(item) {

    var review = new Review(item);

    reviewsArr.push(review);

    reviewsList.appendChild(review.element);
  });

  reviewsFilter.classList.remove('invisible');
});
