'use strict';

var ReviewData = require('./review-data.js');
var Review = require('./review.js');

var load = require('./load.js');

var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews';
var PAGE_SIZE = 3;

var reviews = [];
var curPage = 0;
var curFilter = localStorage.getItem('curFilter') || 'reviews-all';

var reviewsSection = document.querySelector('.reviews');

var reviewsFilter = reviewsSection.querySelector('.reviews-filter');
var reviewsContainer = reviewsSection.querySelector('.reviews-list');
var reviewsNextButton = reviewsSection.querySelector('.reviews-controls-more');


load(REVIEWS_LOAD_URL, getURLOptions(curPage, curFilter), renderReviewsContainer);

reviewsNextButton.addEventListener('click', function() {

  load(REVIEWS_LOAD_URL, getURLOptions(++curPage, curFilter), renderReviewsContainer);
});

reviewsNextButton.classList.remove('invisible');

var checkedFilter = reviewsFilter.querySelector('input[value="' + curFilter + '"]');

if (checkedFilter) {
  checkedFilter.checked = true;
}

reviewsFilter.addEventListener('click', function(evt) {

  if (evt.target.classList.contains('reviews-filter-item')) {
    applyFilter(evt.target.getAttribute('for'));
  }
}, true);


function renderReviewsContainer(data) {

  if (!data || !data.length) return;

  reviewsFilter.classList.add('invisible');

  var reviewItems = data.map(function(item) {
    return new Review(new ReviewData(item));
  });

  reviewItems.forEach(function(item) {
    item.show(reviewsContainer);
  });

  Array.prototype.push.apply(reviews, reviewItems);

  reviewsFilter.classList.remove('invisible');
}

function clearReviewsContainer() {

  reviews.forEach(function(item) {
    item.remove();
  });

  reviews.length = 0;
}

function getURLOptions(page, filterName) {

  var options = '';

  options += '?from=' + (page * PAGE_SIZE) || 0;
  options += '&to=' + (page * PAGE_SIZE + PAGE_SIZE) || Number.MAX_VALUE;
  options += '&filter=' + filterName || 'reviews-all';

  return options;
}

function applyFilter(filterName) {

  if (filterName === curFilter) return;

  curFilter = filterName;
  curPage = 0;

  load(REVIEWS_LOAD_URL, getURLOptions(curPage, curFilter), function(data) {

    clearReviewsContainer();

    renderReviewsContainer(data);

    localStorage.setItem('curFilter', curFilter);
  });
}


