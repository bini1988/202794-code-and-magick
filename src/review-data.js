'use strict';

var ReviewData = function(data) {
  this.created = data.created;
  this.authorName = data.author.name;
  this.authorPicture = data.author.picture;
  this.reviewUsefulness = data.review_usefulness;
  this.rating = data.rating;
  this.description = data.description;
};

ReviewData.prototype.getCreationDate = function() {
  return this.created;
};

ReviewData.prototype.getAuthorName = function() {
  return this.authorName;
};

ReviewData.prototype.getAuthorPicture = function() {
  return this.authorPicture;
};

ReviewData.prototype.getUsefulness = function() {
  return this.reviewUsefulness;
};

ReviewData.prototype.upUsefulness = function() {
  return this.reviewUsefulness++;
};

ReviewData.prototype.downUsefulness = function() {
  return this.reviewUsefulness--;
};

ReviewData.prototype.getRating = function() {
  return this.rating;
};

ReviewData.prototype.getDescription = function() {
  return this.description;
};

module.exports = ReviewData;
