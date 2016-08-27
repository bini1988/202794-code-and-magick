'use strict';

var browserCookies = require('browser-cookies');

module.exports = (function() {

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

  var reviewName = browserCookies.get('review-name');
  var reviewMark = browserCookies.get('review-mark');

  var checkedReviewMark = formReview.querySelector('input[value="' + reviewMark + '"]');

  var form = {
    onClose: null,

        /**
         * @param {Function} cb
         */
    open: function(cb) {
      formContainer.classList.remove('invisible');
      cb();
    },

    close: function() {
      formContainer.classList.add('invisible');

      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  };


  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    form.close();
  };


  var getCookieExpireDays = function() {

    var nowDate = new Date();

    var nowYear = nowDate.getFullYear();
    var nowMonth = nowDate.getMonth() + 1;
    var nowDay = nowDate.getDate();

    // Считаем количество дней, прошедших с последнего
    // прошедшего дня рождения Грейс Хоппер (9 декабря 1906)
    var birthdayMonth = 9;
    var birthdayDay = 12;

    var birthdayDate = new Date(nowYear, birthdayMonth - 1, birthdayDay);

    nowDate = new Date(nowYear, nowMonth - 1, nowDay);

    if ((nowDate - birthdayDate) < 0) {
      //Последнее день рождение было в прошлом году
      birthdayDate = new Date(nowYear - 1, birthdayMonth - 1, birthdayDay);
    }

    return (nowDate - birthdayDate) / 1000 / 3600 / 24;
  };

  formReview.onsubmit = function() {

    var reviewMarkValue = formReview.querySelector('input[name="review-mark"]:checked').value;

    var expireDate = { expires: getCookieExpireDays() };

    browserCookies.set('review-name', formReviewName.value, expireDate);
    browserCookies.set('review-mark', reviewMarkValue, expireDate);
  };


  formReviewName.value = (reviewName) ? reviewName : '';
  formReviewName.required = true;

  if (checkedReviewMark) {
    checkedReviewMark.checked = true;
  }

  formReviewText.value = '';

  formReviewSubmit.disabled = true;

  var TEXT_REQUIRED_MARK = 3;

  var isNotEmpty = function(tag) {
    return tag.value.trim().length;
  };

  var validateReviewForm = function() {

    var reviewMarkValue = formReview.querySelector('input[name="review-mark"]:checked').value;

    var isSubmitAllowed = isNotEmpty(formReviewName) &&
      ((reviewMarkValue < TEXT_REQUIRED_MARK && isNotEmpty(formReviewText)) ||
        (reviewMarkValue >= TEXT_REQUIRED_MARK));

    formReviewSubmit.disabled = !isSubmitAllowed;

    formReviewFields.style.display = isSubmitAllowed ? 'none' : 'inline-block';

  };


  formReviewName.oninput = function() {

    formReviewNameLabel.style.display = isNotEmpty(formReviewName) ? 'none' : 'inline';

    validateReviewForm();
  };

  formReviewText.oninput = function() {

    formReviewTextLabel.style.display = isNotEmpty(formReviewText) ? 'none' : 'inline';

    validateReviewForm();
  };


  for (var i = 0; i < formReviewMarks.length; i++) {

    formReviewMarks[i].onchange = function(evt) {

      formReviewText.required = (evt.currentTarget.value < TEXT_REQUIRED_MARK);

      validateReviewForm();
    };
  }

  return form;

})();
