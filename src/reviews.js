'use strict';

var Review = require('./review.js');

var load = require('./load.js');

var REVIEWS_LOAD_URL = 'http://localhost:1506/api/reviews';
var PAGE_SIZE = 3;

var reviewsArr = [];
var currentPage = 0;
var savedFilter = localStorage.getItem('currentFilter');
var currentFilter = savedFilter || 'reviews-all';

var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsContainer = document.querySelector('.reviews-list');
var reviewsNextReviewButton = document.querySelector('.reviews-controls-more');

function renderReviews(reviews) {

  reviewsFilter.classList.add('invisible');

  reviews.forEach(function(item) {

    var review = new Review(item);

    reviewsArr.push(review);

    review.show(reviewsContainer);
  });

  reviewsFilter.classList.remove('invisible');
}

function clearReviewsContainer() {

  reviewsArr.forEach(function(item) {
    item.remove();
  });

  reviewsArr = [];
}

function getLoadOptions(page, filterName) {

  var options = '';

  options += '?from=' + (page * PAGE_SIZE) || 0;
  options += '&to=' + (page * PAGE_SIZE + PAGE_SIZE) || Number.MAX_VALUE;
  options += '&filter=' + filterName || 'reviews-all';

  return options;
}

load(REVIEWS_LOAD_URL, getLoadOptions(currentPage, currentFilter), renderReviews);


/**
  * Загрузить отзывы
  */

reviewsNextReviewButton.addEventListener('click', function() {

  load(REVIEWS_LOAD_URL, getLoadOptions(++currentPage, currentFilter), function(reviews) {
    if (reviews && reviews.length > 0) {
      renderReviews(reviews);
    }
  });
});

reviewsNextReviewButton.classList.remove('invisible');


/**
  * Фильтры
  */

function applyFilter(filterName) {

  currentFilter = filterName;
  currentPage = 0;

  load(REVIEWS_LOAD_URL, getLoadOptions(currentPage, currentFilter), function(reviews) {

    clearReviewsContainer();
    renderReviews(reviews);

    localStorage.setItem('currentFilter', currentFilter);
  });
}

var checkedFilter = reviewsFilter.querySelector('input[value="' + currentFilter + '"]');

if (checkedFilter) {
  checkedFilter.checked = true;
}

reviewsFilter.addEventListener('click', function(evt) {

  if (evt.target.classList.contains('reviews-filter-item')) {

    var filterName = evt.target.getAttribute('for');

    if (filterName !== currentFilter) {
      applyFilter(filterName);
    }
  }
}, true);
