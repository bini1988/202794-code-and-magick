'use strict';

var ReviewData = function(data) {
  this.data = data;
};

ReviewData.prototype.onUsefulnessChange = null;

ReviewData.prototype.getCreationDate = function() {
  return this.data.created;
};

ReviewData.prototype.getAuthorName = function() {
  return this.data.author.name;
};

ReviewData.prototype.getAuthorPicture = function() {
  return this.data.author.picture;
};

ReviewData.prototype.getUsefulness = function() {
  return this.data.review_usefulness;
};

ReviewData.prototype.upUsefulness = function() {

  if (typeof this.onUsefulnessChange === 'function') {
    this.onUsefulnessChange(this, { isUseful: true });
  }

  return this.data.review_usefulness++;
};

ReviewData.prototype.downUsefulness = function() {

  if (typeof this.onUsefulnessChange === 'function') {
    this.onUsefulnessChange(this, { isUseful: false });
  }

  return this.data.review_usefulness--;
};

ReviewData.prototype.getRating = function() {
  return this.data.rating;
};

ReviewData.prototype.getDescription = function() {
  return this.data.description;
};

module.exports = ReviewData;
