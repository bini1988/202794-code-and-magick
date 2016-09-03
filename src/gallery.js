'use strict';

var Gallery = function(srcList) {
  this.pictures = srcList;
  this.activePicture = 0;
  this.galleryOverlay = document.querySelector('.overlay-gallery');
  this.galleryLeftControl = document.querySelector('.overlay-gallery-control-left');
  this.galleryRightControl = document.querySelector('.overlay-gallery-control-right');
  this.galleryCurrent = document.querySelector('.preview-number-current');
  this.galleryTotal = document.querySelector('.preview-number-total');
  this.galleryClose = document.querySelector('.overlay-gallery-close');
};

Gallery.prototype.show = function(activePictureIndex) {

  var self = this;

  this.galleryClose.onclick = function() {
    self.hide();
  };

  this.galleryRightControl.onclick = function() {
    self.setActivePicture(self.activePicture + 1);
  };

  this.galleryLeftControl.onclick = function() {
    self.setActivePicture(self.activePicture - 1);
  };

  this.galleryOverlay.classList.remove('invisible');

  this.setActivePicture(activePictureIndex);
};

Gallery.prototype.hide = function() {

  this.galleryOverlay.classList.add('invisible');

  this.galleryClose.onclick = null;
  this.galleryRightControl.onclick = null;
  this.galleryLeftControl.onclick = null;
};

Gallery.prototype.setActivePicture = function(activePictureIndex) {

  var IMAGE_LOAD_TIMEOUT = 10000;
  var GALLERY_IMAGE_WIDHT = 800;
  var GALLERY_IMAGE_HEIGHT = 800;

  var self = this;

  activePictureIndex = (activePictureIndex < 0) ? 0 : activePictureIndex;

  this.activePicture = (activePictureIndex >= this.pictures.length) ?
    this.pictures.length - 1 : activePictureIndex;

  var galleryPicture = new Image(GALLERY_IMAGE_WIDHT, GALLERY_IMAGE_HEIGHT);

  var pictureLoadTimeout;

  galleryPicture.onload = function() {
    clearTimeout(pictureLoadTimeout);

    var galleryPerview = document.querySelector('.overlay-gallery-preview');
    var galleryPerviewImg = document.querySelector('.overlay-gallery-preview img');

    if (galleryPerviewImg) {
      galleryPerview.replaceChild(galleryPicture, galleryPerviewImg);
    } else {
      galleryPerview.appendChild(galleryPicture);
    }

    self.galleryCurrent.textContent = self.activePicture + 1;
    self.galleryTotal.textContent = self.pictures.length;
  };

  galleryPicture.onerror = function() {
    galleryPicture.src = '';
  };

  pictureLoadTimeout = setTimeout(function() {
    galleryPicture.src = '';
  }, IMAGE_LOAD_TIMEOUT);

  galleryPicture.src = this.pictures[this.activePicture];
};

module.exports = Gallery;
