'use strict';

(function() {

    var HOUSING_TYPE_MIN_PRICE = {
    'flat' : 1000,
    'bungalo' : 0,
    'house' : 5000,
    'palace' : 10000
  };

  var noticeAdForm = document.querySelector('form.notice__form');
  var addressFiled = noticeAdForm.querySelector('fieldset input#address');
  var titleFiled = noticeAdForm.querySelector('fieldset input#title');
  var priceFiled = noticeAdForm.querySelector('fieldset input#price');
  var timeIn = noticeAdForm.querySelector('fieldset select#timein');
  var timeOut = noticeAdForm.querySelector('fieldset select#timeout');
  var housingType = noticeAdForm.querySelector('fieldset select#type');
  var roomsCount = noticeAdForm.querySelector('fieldset select#room_number');
  var guestCount = noticeAdForm.querySelector('fieldset select#capacity');
  //var buttonSubmit = noticeAdForm.querySelector('fieldset select#capacity');

  noticeAdForm.action = 'https://js.dump.academy/keksobooking';

  addressFiled.readOnly = true;
  addressFiled.required = true;
  addressFiled.value = "123"; // иначе форма не верна, что-то в ней долждно быть. Хотя сама readonly

  titleFiled.required = true;
  titleFiled.minLength = 30;
  titleFiled.maxLength = 100;

  priceFiled.required = true;
  priceFiled.min = 0;
  priceFiled.max = 1000000;
  priceFiled.placeholder = 1000;

  timeIn. addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
  housingType.addEventListener('change', onTypeChange);
  roomsCount.addEventListener('change', onRoomsChange);

  function onTimeInChange() {

    syncTimeInOut(timeOut, timeIn.selectedIndex);
  }

  function onTimeOutChange() {

    syncTimeInOut(timeIn, timeOut.selectedIndex);
  }

  function onTypeChange() {

    var selectedIndex = housingType.selectedIndex;

    setMinPrice(HOUSING_TYPE_MIN_PRICE[housingType.options[selectedIndex].value]);
  }

  function onRoomsChange() {

    var selectedIndex = roomsCount.selectedIndex;
    var roomValue = roomsCount.options[selectedIndex].value;

    if (roomValue === '100') {
      roomValue = '0';
    }

    setGuestCountByValue(roomValue);
  }

  function onSubmitButtonClick() {

  }

  function setGuestCountByValue(value) {

    for (var i = 0; i < guestCount.children.length; i++) {

      if (guestCount.children[i].value === value) {

        guestCount.selectedIndex = i;
        break;
      }
    }
  }

  function syncTimeInOut(timeField, index) {

    timeField.selectedIndex = index;
  }

  function setMinPrice(price) {

    priceFiled.min = price;
  }

  var t = 0;


})();