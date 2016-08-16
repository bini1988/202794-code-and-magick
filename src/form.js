'use strict';

window.form = (function() {
  var formContainer = document.querySelector('.overlay-container');
  var formCloseButton = document.querySelector('.review-form-close');

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

  var formReview = document.querySelector('.review-form');
  var formReviewFields = formReview.querySelector('.review-fields');

  var formReviewName = formReview.querySelector('#review-name');
  var formReviewNameLabel = formReviewFields.querySelector('label[for="review-name"]');

  var formReviewText = formReview.querySelector('#review-text');
  var formReviewTextLabel = formReviewFields.querySelector('label[for="review-text"]');

  var formReviewSubmit = formReview.querySelector('.review-submit');

  formReviewName.value = '';
  formReviewName.required = true;

  formReviewText.value = '';

  formReviewSubmit.disabled = true;

  var TEXT_REQUIRED_MARK = 3;

  var isNotEmpty = function(tag) {
    return tag.value.trim().length;
  };

  var validateReviewForm = function() {

    var reviewMark = formReview.querySelector('input[name="review-mark"]:checked').value;

    var isSubmitAllowed = isNotEmpty(formReviewName) &&
      ((reviewMark < TEXT_REQUIRED_MARK && isNotEmpty(formReviewText)) ||
        (reviewMark >= TEXT_REQUIRED_MARK));

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


  var formReviewMarks = formReview.querySelectorAll('input[name="review-mark"]');

  for (var i = 0; i < formReviewMarks.length; i++) {

    formReviewMarks[i].onchange = function(evt) {

      formReviewText.required = (evt.currentTarget.value < TEXT_REQUIRED_MARK);

      validateReviewForm();
    };
  }

  return form;

})();
