'use strict';

var browserCookies = require('browser-cookies');

var TEXT_REQUIRED_MARK = 3;

var reviewName = browserCookies.get('review-name');
var reviewMark = browserCookies.get('review-mark');
var checkedReviewMark = null;

var form = {
  onClose: null,
  open: function(cb) {
    formContainer.classList.remove('invisible');
    cb();
  },
  close: function() {

    formContainer.classList.add('invisible');

    if (this.onClose === 'function') {
      this.onClose();
    }
  }
};

var formContainer = document.querySelector('.overlay-container');
var formCloseButton = document.querySelector('.review-form-close');

var formReview = document.querySelector('.review-form');
var formReviewFields = formReview.querySelector('.review-fields');

var formReviewName = formReview.querySelector('#review-name');
var formReviewNameLabel = formReviewFields.querySelector('label[for="review-name"]');

var formReviewText = formReview.querySelector('#review-text');
var formReviewTextLabel = formReviewFields.querySelector('label[for="review-text"]');

var formReviewSubmit = formReview.querySelector('.review-submit');
var formReviewMarks = formReview.querySelectorAll('input[name="review-mark"]');


formReviewName.value = (reviewName) ? reviewName : '';
formReviewName.required = true;

checkedReviewMark = formReview.querySelector('input[value="' + reviewMark + '"]');

if (checkedReviewMark) {
  checkedReviewMark.checked = true;
}

formReviewText.value = '';

formReviewSubmit.disabled = true;

validateReviewForm();


Array.prototype.forEach.call(formReviewMarks, function(item) {
  item.addEventListener('change', validateReviewForm);
});

formReviewName.addEventListener('input', validateReviewForm);

formReviewText.addEventListener('input', validateReviewForm);

formReview.addEventListener('submit', function() {

  var reviewMarkValue = formReview.querySelector('input[name="review-mark"]:checked').value;
  var expireDate = { expires: getCookieExpireDays() };

  browserCookies.set('review-name', formReviewName.value, expireDate);
  browserCookies.set('review-mark', reviewMarkValue, expireDate);
});

formCloseButton.addEventListener('click', function(evt) {
  evt.preventDefault();
  form.close();
});


function validateReviewForm() {

  var reviewMarkValue = formReview.querySelector('input[name="review-mark"]:checked').value;

  var isSubmitAllowed = isNotEmpty(formReviewName) &&
    ((reviewMarkValue < TEXT_REQUIRED_MARK && isNotEmpty(formReviewText)) ||
      (reviewMarkValue >= TEXT_REQUIRED_MARK));

  formReviewSubmit.disabled = !isSubmitAllowed;

  formReviewText.required = (reviewMarkValue < TEXT_REQUIRED_MARK);

  formReviewFields.style.display = isSubmitAllowed ? 'none' : 'inline-block';

  formReviewNameLabel.style.display = isNotEmpty(formReviewName) ? 'none' : 'inline';

  formReviewTextLabel.style.display = !formReviewText.required ||
    (formReviewText.required && isNotEmpty(formReviewText)) ? 'none' : 'inline';
}

function getCookieExpireDays() {

  var nowDate = new Date();

  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1;
  var nowDay = nowDate.getDate();

  var birthdayMonth = 9;
  var birthdayDay = 12;

  var birthdayDate = new Date(nowYear, birthdayMonth - 1, birthdayDay);

  nowDate = new Date(nowYear, nowMonth - 1, nowDay);

  if ((nowDate - birthdayDate) < 0) {
    birthdayDate = new Date(nowYear - 1, birthdayMonth - 1, birthdayDay);
  }

  return (nowDate - birthdayDate) / 1000 / 3600 / 24;
}

function isNotEmpty(tag) {
  return tag.value.trim().length;
}

module.exports = form;
