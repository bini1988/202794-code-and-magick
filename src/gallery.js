'use strict';

var BaseComponent = require('./base-component.js');
var utils = require('./utils.js');

var Gallery = function(srcList) {
  this.pictures = srcList;
  this.activePictureIndex = 0;
  this.pictureLoadTimeout = null;
  this.activePictureImg = null;

  this.galleryOverlay = document.querySelector('.overlay-gallery');

  BaseComponent.call(this, this.galleryOverlay);

  this.galleryClose = this.element.querySelector('.overlay-gallery-close');
  this.galleryRightControl = this.element.querySelector('.overlay-gallery-control-right');
  this.galleryLeftControl = this.element.querySelector('.overlay-gallery-control-left');

  this.galleryCurrent = this.element.querySelector('.preview-number-current');
  this.galleryTotal = this.element.querySelector('.preview-number-total');
  this.galleryPerview = this.element.querySelector('.overlay-gallery-preview');

  this.onGalleryCloseClick = this.onGalleryCloseClick.bind(this);
  this.onGalleryRightControlClick = this.onGalleryRightControlClick.bind(this);
  this.onGalleryLeftControlClick = this.onGalleryLeftControlClick.bind(this);
  this.onGalleryPictureLoad = this.onGalleryPictureLoad.bind(this);
  this.onGalleryPictureLoadAborted = this.onGalleryPictureLoadAborted.bind(this);
};

utils.inherit(Gallery, BaseComponent);

Gallery.prototype.show = function(activePictureIndex) {

  this.galleryClose.addEventListener('click', this.onGalleryCloseClick);
  this.galleryRightControl.addEventListener('click', this.onGalleryRightControlClick);
  this.galleryLeftControl.addEventListener('click', this.onGalleryLeftControlClick);

  this.setActivePicture(activePictureIndex);
};

Gallery.prototype.remove = function() {

  this.hide();

  BaseComponent.prototype.remote.call(this);
};

Gallery.prototype.hide = function() {

  this.element.classList.add('invisible');

  this.galleryClose.removeEventListener('click', this.onGalleryCloseClick);
  this.galleryRightControl.removeEventListener('click', this.onGalleryRightControlClick);
  this.galleryLeftControl.removeEventListener('click', this.onGalleryLeftControlClick);
};

Gallery.prototype.onGalleryCloseClick = function() {
  this.hide();
};

Gallery.prototype.onGalleryRightControlClick = function() {
  this.setActivePicture(this.activePictureIndex + 1);
};

Gallery.prototype.onGalleryLeftControlClick = function() {
  this.setActivePicture(this.activePictureIndex - 1);
};

Gallery.prototype.onGalleryPictureLoad = function() {

  clearTimeout(this.pictureLoadTimeout);

  var galleryPerviewImg = this.galleryPerview.querySelector('img');

  if (galleryPerviewImg) {
    this.galleryPerview.replaceChild(this.activePictureImg, galleryPerviewImg);
  } else {
    this.galleryPerview.appendChild(this.activePictureImg);
  }

  this.galleryCurrent.textContent = this.activePictureIndex + 1;
  this.galleryTotal.textContent = this.pictures.length;

  this.element.classList.remove('invisible');
};

Gallery.prototype.onGalleryPictureLoadAborted = function() {
  this.activePictureImg.src = '';
};

Gallery.prototype.setActivePicture = function(pictureIndex) {

  var IMAGE_LOAD_TIMEOUT = 10000;
  var GALLERY_IMAGE_WIDHT = 800;
  var GALLERY_IMAGE_HEIGHT = 800;

  pictureIndex = (pictureIndex < 0) ? 0 : pictureIndex;

  this.activePictureIndex = (pictureIndex >= this.pictures.length) ?
    this.pictures.length - 1 : pictureIndex;

  this.activePictureImg = new Image(GALLERY_IMAGE_WIDHT, GALLERY_IMAGE_HEIGHT);

  this.activePictureImg.addEventListener('load', this.onGalleryPictureLoad);
  this.activePictureImg.addEventListener('error', this.onGalleryPictureLoadAborted);

  this.pictureLoadTimeout =
    setTimeout(this.onGalleryPictureLoadAborted, IMAGE_LOAD_TIMEOUT);

  this.activePictureImg.src = this.pictures[this.activePictureIndex];
};

module.exports = Gallery;
