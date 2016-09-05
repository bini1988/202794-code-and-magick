'use strict';

function isRecentReview(review) {
  var DAYS_AGO = 3;
  var daysAgoDate = new Date();

  daysAgoDate.setDate(daysAgoDate.getDate() - DAYS_AGO);
  daysAgoDate.setHours(0, 0, 0, 0);

  return review.created > daysAgoDate;
}

var GOOD_MIN_RAITING = 3;

function isGoodReview(review) {

  return review.rating >= GOOD_MIN_RAITING;
}

function isBadReview(review) {

  return review.rating < GOOD_MIN_RAITING;
}


module.exports = function(list, filterID) {

  var outList = list;
  
  switch(filterID) {
    case 'reviews-all':
      outList = list;
      outList.sort(function(a, b) {
        return new Date(b.created) - new Date(a.created);
      });
      break;
    case 'reviews-recent':
      outList = list.filter(isRecentReview);
      outList.sort(function(a, b) {
        return new Date(b.created) - new Date(a.created);
      });
      break;
    case 'reviews-good':
      outList = list.filter(isGoodReview);
      outList.sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;
    case 'reviews-bad':
      outList = list.filter(isBadReview);
      outList.sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;
    case 'reviews-popular':
      outList.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  };
  
  return outList;
};
