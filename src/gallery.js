'use strict';

var Gallery = function(srcList) {
  this.pictures = srcList;
  this.activePicture = 0;
  this.pictureLoadTimeout = null;
  this.galleryPicture = null;

  this.galleryOverlay = document.querySelector('.overlay-gallery');
  this.galleryClose = document.querySelector('.overlay-gallery-close');
  this.galleryRightControl = document.querySelector('.overlay-gallery-control-right');
  this.galleryLeftControl = document.querySelector('.overlay-gallery-control-left');
  this.galleryCurrent = document.querySelector('.preview-number-current');
  this.galleryTotal = document.querySelector('.preview-number-total');
  this.galleryPerview = document.querySelector('.overlay-gallery-preview');

  this.onGalleryCloseClick = this.onGalleryCloseClick.bind(this);
  this.onGalleryRightControlClick = this.onGalleryRightControlClick.bind(this);
  this.onGalleryLeftControlClick = this.onGalleryLeftControlClick.bind(this);
  this.onGalleryPictureLoad = this.onGalleryPictureLoad.bind(this);
};

Gallery.prototype.show = function(activePictureIndex) {

  this.galleryClose.addEventListener('click', this.onGalleryCloseClick);
  this.galleryRightControl.addEventListener('click', this.onGalleryRightControlClick);
  this.galleryLeftControl.addEventListener('click', this.onGalleryLeftControlClick);

  this.setActivePicture(activePictureIndex);
};

Gallery.prototype.onGalleryCloseClick = function() {
  this.hide();
};

Gallery.prototype.onGalleryRightControlClick = function() {
  this.setActivePicture(this.activePicture + 1);
};

Gallery.prototype.onGalleryLeftControlClick = function() {
  this.setActivePicture(this.activePicture - 1);
};

Gallery.prototype.hide = function() {

  this.galleryOverlay.classList.add('invisible');

  this.galleryClose.removeEventListener('click', this.onGalleryCloseClick);
  this.galleryRightControl.removeEventListener('click', this.onGalleryRightControlClick);
  this.galleryLeftControl.removeEventListener('click', this.onGalleryLeftControlClick);
};

Gallery.prototype.onGalleryPictureLoad = function() {

  clearTimeout(this.pictureLoadTimeout);

  var galleryPerviewImg = document.querySelector('.overlay-gallery-preview img');

  if (galleryPerviewImg) {
    this.galleryPerview.replaceChild(this.galleryPicture, galleryPerviewImg);
  } else {
    this.galleryPerview.appendChild(this.galleryPicture);
  }

  this.galleryCurrent.textContent = this.activePicture + 1;
  this.galleryTotal.textContent = this.pictures.length;

  this.galleryOverlay.classList.remove('invisible');
};

Gallery.prototype.setActivePicture = function(activePictureIndex) {

  var IMAGE_LOAD_TIMEOUT = 10000;
  var GALLERY_IMAGE_WIDHT = 800;
  var GALLERY_IMAGE_HEIGHT = 800;

  activePictureIndex = (activePictureIndex < 0) ? 0 : activePictureIndex;

  this.activePicture = (activePictureIndex >= this.pictures.length) ?
    this.pictures.length - 1 : activePictureIndex;

  this.galleryPicture = new Image(GALLERY_IMAGE_WIDHT, GALLERY_IMAGE_HEIGHT);

  this.galleryPicture.addEventListener('load', this.onGalleryPictureLoad);

  var onGalleryPictureLoadAborted = function() {
    this.galleryPicture.src = '';
  };

  this.galleryPicture.addEventListener('error', onGalleryPictureLoadAborted);

  this.pictureLoadTimeout =
    setTimeout(onGalleryPictureLoadAborted, IMAGE_LOAD_TIMEOUT);

  this.galleryPicture.src = this.pictures[this.activePicture];
};

module.exports = Gallery;
