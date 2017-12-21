'use strict';

window.form = (function () {

  var BORDER_ERROR_COLOR = '#cc0000';
  var BORDER_ERROR_WIDTH = '1.5px';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var noticeAdForm = document.querySelector('form.notice__form');
  var addressFiled = noticeAdForm.querySelector('fieldset input#address');
  var titleFiled = noticeAdForm.querySelector('fieldset input#title');
  var priceFiled = noticeAdForm.querySelector('fieldset input#price');
  var timeIn = noticeAdForm.querySelector('fieldset select#timein');
  var timeOut = noticeAdForm.querySelector('fieldset select#timeout');
  var housingType = noticeAdForm.querySelector('fieldset select#type');
  var roomsCount = noticeAdForm.querySelector('fieldset select#room_number');
  var guestCount = noticeAdForm.querySelector('fieldset select#capacity');
  var buttonSubmit = noticeAdForm.querySelector('fieldset button.form__submit');
  var discription = noticeAdForm.querySelector('#description');
  var avatarPreview = noticeAdForm.querySelector('div.notice__preview img');
  var avatarChooser = noticeAdForm.querySelector('#avatar');
  var avatarChooserLabel = noticeAdForm.querySelector('label.drop-zone');

  var callbackSubmitForm;

  initAddNoticeForm();

  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
  housingType.addEventListener('change', onTypeChange);
  roomsCount.addEventListener('change', onRoomsChange);
  buttonSubmit.addEventListener('click', onSubmitButtonClick);
  avatarChooser.addEventListener('change', onAvatarChooserChanger);
  avatarChooserLabel.addEventListener('drop', onAvatarChooserLabelDrop);
  avatarChooserLabel.addEventListener('dragover', onAvatarChooserLabelDragOver);
  avatarChooserLabel.addEventListener('dragenter', onAvatarChooserLabelDragEnter);
  avatarChooserLabel.addEventListener('dragleave', onAvatarChooserLabelDragLeave);

  function onAvatarChooserLabelDrop(evt) {

    evt.target.style.backgroundColor = '';
    evt.preventDefault();

    var avatarFile = evt.dataTransfer.files[0];
    loadAvatarPreview(avatarFile);
  }

  function onAvatarChooserLabelDragOver(evt) {

    evt.preventDefault();
    return false;
  }

  function onAvatarChooserLabelDragEnter(evt) {

    evt.target.style.backgroundColor = '#d6d6f5';
    evt.preventDefault();
  }

  function onAvatarChooserLabelDragLeave(evt) {

     evt.target.style.backgroundColor = '';
     evt.preventDefault();
  }

  function onAvatarChooserChanger() {

    var avatarFile = avatarChooser.files[0];
    loadAvatarPreview(avatarFile);
  }

  function loadAvatarPreview(avatarFile) {

    var avatarName = avatarFile.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return avatarName.endsWith(it);
    });

    if (matches) {

      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(avatarFile);
    }
  }

  function onTimeInChange() {

    window.synchronizeFields.synchronizeFields(timeIn, timeOut, window.data.OFFER_CHECKS, window.data.OFFER_CHECKS, syncTimeInOut);
  }

  function onTimeOutChange() {

    window.synchronizeFields.synchronizeFields(timeOut, timeIn, window.data.OFFER_CHECKS, window.data.OFFER_CHECKS, syncTimeInOut);
  }

  function onTypeChange() {

    window.synchronizeFields.synchronizeFields(housingType, priceFiled, window.data.OFFER_TYPES, window.data.MIN_PRICE, setMinPrice);
  }

  function onRoomsChange() {

    var rooms = ['1', '2', '3', '100'];
    var guests = ['1', '2', '3', '0'];

    window.synchronizeFields.synchronizeFields(roomsCount, guestCount, rooms, guests, setGuestCountByValue);
  }

  function onSubmitButtonClick(evt) {

    evt.preventDefault();

    var formData = new FormData(noticeAdForm);

    var hasError = checkFileds();

    if (typeof callbackSubmitForm === 'function') {

      if (hasError) {
        callbackSubmitForm(hasError);
      } else {
        callbackSubmitForm(hasError, formData);
      }
    }
  }

  function setCallbackSubmitFunction(func) {

    callbackSubmitForm = func;
  }

  function clearForm() {

    titleFiled.value = '';
    priceFiled.value = '';
    discription.value = '';
  }

  function initAddNoticeForm() {

    noticeAdForm.action = 'https://js.dump.academy/keksobooking';

    addressFiled.readOnly = true;
    addressFiled.required = true;
    addressFiled.value = '123';

    titleFiled.required = true;
    titleFiled.minLength = 30;
    titleFiled.maxLength = 100;

    priceFiled.required = true;
    priceFiled.min = 0;
    priceFiled.max = 1000000;
    priceFiled.placeholder = 1000;

  }

  function checkFileds() {

    var hasError = false;
    var requiredFields = noticeAdForm.querySelectorAll('input[required]');

    for (var i = 0; i < requiredFields.length; i++) {

      var selectElement = requiredFields[i];

      var isValid = selectElement.checkValidity();
      setFieldValid(selectElement, isValid);

      if (!isValid) {
        hasError = true;
      }
    }

    return hasError;
  }

  function setFieldValid(filed, valid) {

    filed.style.borderColor = valid ? '' : BORDER_ERROR_COLOR;
    filed.style.borderWidth = valid ? '' : BORDER_ERROR_WIDTH;
  }

  function setGuestCountByValue(filed, value) {

    var foundSomething = false;
    var zeroElement;

    value = parseInt(value, 10);

    for (var i = 0; i < filed.children.length; i++) {

      var selectValue = parseInt(filed.children[i].value, 10);
      var selectElement = filed.children[i];

      if (selectValue === 0) {
        zeroElement = selectElement;
        zeroElement.classList.add('hidden');
        continue;
      }

      if (value >= selectValue && value !== 100) {

        selectElement.classList.remove('hidden');
        foundSomething = true;

      } else {

        selectElement.classList.add('hidden');
      }
    }

    if (foundSomething === false) {
      zeroElement.classList.remove('hidden');
    }

    filed.selectedIndex = filed.querySelector('option:not(.hidden)').index; // первый не скрытый элемент из списка
  }

  function syncTimeInOut(timeField, value) {

    timeField.value = value;
  }

  function setMinPrice(field, price) {

    field.min = price;
  }

  return {

    setNoticeFormDisable: function (able) {

      var formDisableClass = 'notice__form--disabled';

      if (able === false) {
        noticeAdForm.classList.remove(formDisableClass);
      } else {
        noticeAdForm.classList.add(formDisableClass);
      }

      var fields = noticeAdForm.querySelectorAll('fieldset');

      for (var i = 0; i < fields.length; i++) {

        fields[i].disabled = able;
      }
    },
    setAddress: function (x, y) {

      addressFiled.value = 'x: ' + x + ', y:' + y;
    },
    setCallbackSubmitFunction: setCallbackSubmitFunction,
    clearForm: clearForm
  };

})();
