'use strict';

(function () {

  var HOUSING_TYPE_MIN_PRICE = {
    'flat': 1000,
    'bungalo': 0,
    'house': 5000,
    'palace': 10000
  };

  var BORDER_ERROR_COLOR = '#cc0000';
  var BORDER_ERROR_WIDTH = '1.5px';

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

  initAddNoticeForm();

  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
  housingType.addEventListener('change', onTypeChange);
  roomsCount.addEventListener('change', onRoomsChange);
  buttonSubmit.addEventListener('click', onSubmitButtonClick);

  function onTimeInChange() {

    syncTimeInOut(timeOut, timeIn.selectedIndex);
  }

  function onTimeOutChange() {

    syncTimeInOut(timeIn, timeOut.selectedIndex);
  }

  function onTypeChange() {

    setMinPrice(HOUSING_TYPE_MIN_PRICE[housingType.value]);
  }

  function onRoomsChange() {

    var roomValue = roomsCount.value;

    setGuestCountByValue(roomValue);
  }

  function onSubmitButtonClick() {

    checkFileds();
  }

  function initAddNoticeForm() {

    noticeAdForm.action = 'https://js.dump.academy/keksobooking';

    addressFiled.readOnly = true;
    addressFiled.required = true;
    addressFiled.value = '123'; // иначе форма не верна, что-то в ней долждно быть. Хотя сама readonly

    titleFiled.required = true;
    titleFiled.minLength = 30;
    titleFiled.maxLength = 100;

    priceFiled.required = true;
    priceFiled.min = 0;
    priceFiled.max = 1000000;
    priceFiled.placeholder = 1000;
  }

  function checkFileds() {

    var requiredFields = noticeAdForm.querySelectorAll('input[required]');

    for (var i = 0; i < requiredFields.length; i++) {

      var selectElement = requiredFields[i];

      var isValid = selectElement.checkValidity();
      setFieldValid(selectElement, isValid);
    }
  }

  function setFieldValid(filed, valid) {

    filed.style.borderColor = valid ? '' : BORDER_ERROR_COLOR;
    filed.style.borderWidth = valid ? '' : BORDER_ERROR_WIDTH;
  }

  function setGuestCountByValue(value) {

    var foundSomething = false;
    var zeroElement;

    for (var i = 0; i < guestCount.children.length; i++) {

      var selectValue = guestCount.children[i].value;
      var selectElement = guestCount.children[i];

      if (selectValue === '0') {
        zeroElement = selectElement;
        zeroElement.classList.add('hidden');
        continue;
      }

      if (+value <= +selectValue) {

        selectElement.classList.remove('hidden');
        foundSomething = true;

      } else {

        selectElement.classList.add('hidden');
      }

    }

    if (foundSomething === false) {
      zeroElement.classList.remove('hidden');
    }

    guestCount.selectedIndex = guestCount.querySelector('option:not(.hidden)').index; // первый не скрытый элемент
  }

  function syncTimeInOut(timeField, index) {

    timeField.selectedIndex = index;
  }

  function setMinPrice(price) {

    priceFiled.min = price;
  }
})();
