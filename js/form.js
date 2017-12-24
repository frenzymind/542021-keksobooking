'use strict';

window.form = (function () {

  var BORDER_ERROR_COLOR = '#cc0000';
  var BORDER_ERROR_WIDTH = '1.5px';
  var DRAG_ENTER_BACKGROUND_COLOR = '#d6d6f5';
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
  var avatarChooserLabel = noticeAdForm.querySelector('div.notice__photo label.drop-zone');
  var photoContainer = noticeAdForm.querySelector('.form__photo-container');
  var photoChooser = noticeAdForm.querySelector('#images');
  var photoChooserLabel = noticeAdForm.querySelector('div.form__photo-container label.drop-zone');

  var callbackSubmitForm;

  var draggedPhoto;

  initAddNoticeForm();

  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
  housingType.addEventListener('change', onTypeChange);
  roomsCount.addEventListener('change', onRoomsChange);
  buttonSubmit.addEventListener('click', onSubmitButtonClick);

  avatarChooser.addEventListener('change', onAvatarChooserChanger);
  avatarChooserLabel.addEventListener('drop', onAvatarChooserLabelDrop);
  avatarChooserLabel.addEventListener('dragover', onChooserLabelDragOver);
  avatarChooserLabel.addEventListener('dragenter', onChooserLabelDragEnter);
  avatarChooserLabel.addEventListener('dragleave', onChooserLabelDragLeave);

  photoChooser.addEventListener('change', onPhotoChooserChanger);
  photoChooserLabel.addEventListener('drop', onHousingChooserLabelDrop);
  photoChooserLabel.addEventListener('dragover', onChooserLabelDragOver);
  photoChooserLabel.addEventListener('dragenter', onChooserLabelDragEnter);
  photoChooserLabel.addEventListener('dragleave', onChooserLabelDragLeave);

  function onImagesDrop(evt, callback) {

    evt.target.style.backgroundColor = '';
    evt.preventDefault();
    var eventFiles = evt.dataTransfer.files;
    callback(eventFiles);
  }

  function onPhotoDrag(evt) {

    if (evt.target.tagName.toLowerCase() === 'img') {
      draggedPhoto = evt.target;
      evt.dataTransfer.setData('text/plain', evt.target.alt);
    }
  }

  function onPhotoDragOver(evt) {
    evt.preventDefault();
    return false;
  }

  function onPhotoDrop(evt) {

    var target = evt.currentTarget;

    var draggedSibling = draggedPhoto.nextSibling;
    var targetSibling = target.nextSibling;

    if (targetSibling) {
      photoContainer.insertBefore(draggedPhoto, targetSibling);
    } else {
      photoContainer.appendChild(draggedPhoto);
    }

    if (draggedSibling) {
      photoContainer.insertBefore(target, draggedSibling);
    } else {
      photoContainer.appendChild(target);
    }
  }

  function onPhotoChooserChanger() {

    var photoFiles = photoChooser.files;
    loadHousingPreview(photoFiles);
  }

  function onHousingChooserLabelDrop(evt) {

    onImagesDrop(evt, function (files) {
      loadHousingPreview(files);
    });
  }

  function loadHousingPreview(photoFiles) {

    var arrayPhotos = Array.from(photoFiles);

    arrayPhotos.forEach(function (photo) {
      var photoName = photo.name.toLowerCase();

      var matches = FILE_TYPES.some(function (type) {
        return photoName.endsWith(type);
      });

      if (matches) {
        createEventLoadForPhoto(photo);
      }
    });
  }

  function createEventLoadForPhoto(photo) {

    var reader = new FileReader();

    var imgDom = document.createElement('IMG');
    imgDom.width = '44';
    imgDom.height = '40';

    reader.addEventListener('load', function () {
      imgDom.src = reader.result;
      photoContainer.appendChild(imgDom);
    });

    reader.readAsDataURL(photo);

    imgDom.addEventListener('dragstart', onPhotoDrag);
    imgDom.addEventListener('dragover', onPhotoDragOver);
    imgDom.addEventListener('drop', onPhotoDrop);
  }

  function onAvatarChooserLabelDrop(evt) {

    onImagesDrop(evt, function (files) {
      loadAvatarPreview(files[0]);
    });
  }

  function onChooserLabelDragOver(evt) {

    evt.preventDefault();
    return false;
  }

  function onChooserLabelDragEnter(evt) {

    evt.target.style.backgroundColor = DRAG_ENTER_BACKGROUND_COLOR;
    evt.preventDefault();
  }

  function onChooserLabelDragLeave(evt) {

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

    window.synchronizeFields.syncTwoFields(timeIn, timeOut, window.data.OFFER_CHECKS, window.data.OFFER_CHECKS, syncTimeInOut);
  }

  function onTimeOutChange() {

    window.synchronizeFields.syncTwoFields(timeOut, timeIn, window.data.OFFER_CHECKS, window.data.OFFER_CHECKS, syncTimeInOut);
  }

  function onTypeChange() {

    window.synchronizeFields.syncTwoFields(housingType, priceFiled, window.data.OFFER_TYPES, window.data.MIN_PRICE, setMinPrice);
  }

  function onRoomsChange() {

    var rooms = ['1', '2', '3', '100'];
    var guests = ['1', '2', '3', '0'];

    window.synchronizeFields.syncTwoFields(roomsCount, guestCount, rooms, guests, setGuestCountByValue);
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

    setAddress(0, 0);

    avatarPreview.src = 'img/avatars/default.png';

    var housingPhotos = photoContainer.querySelectorAll('img');

    housingPhotos.forEach(function (photo) {
      photoContainer.removeChild(photo);
    });

    var features = document.querySelectorAll('fieldset.form__element.features.form__element--wide input');

    features.forEach(function (featureCheckbox) {
      featureCheckbox.checked = false;
    });

  }

  function initAddNoticeForm() {

    noticeAdForm.action = 'https://js.dump.academy/keksobooking';

    addressFiled.readOnly = true;
    addressFiled.required = true;
    setAddress(0, 0);

    titleFiled.required = true;
    titleFiled.minLength = 30;
    titleFiled.maxLength = 100;

    priceFiled.required = true;
    priceFiled.min = 0;
    priceFiled.max = 1000000;
    priceFiled.placeholder = 1000;

    photoChooser.multiple = true;
  }

  function checkFileds() {

    var hasError = false;
    var requiredFields = noticeAdForm.querySelectorAll('input[required]');

    requiredFields.forEach(function (field) {

      var isValid = field.checkValidity();
      setFieldValid(field, isValid);

      if (!isValid) {
        hasError = true;
      }
    });

    return hasError;
  }

  function setFieldValid(filed, valid) {

    filed.style.borderColor = valid ? '' : BORDER_ERROR_COLOR;
    filed.style.borderWidth = valid ? '' : BORDER_ERROR_WIDTH;
  }

  function setGuestCountByValue(guestSelect, guestValue) {

    guestValue = parseInt(guestValue, 10);

    Array.from(guestSelect.options).forEach(function (option) {

      var optionValue = parseInt(option.value, 10);

      var isEmptyCapacity = guestValue === 0 && optionValue === 0;
      var isValidCapacity = optionValue !== 0 && optionValue <= guestValue;

      if (isEmptyCapacity || isValidCapacity) {
        option.classList.remove('hidden');
      } else {
        option.classList.add('hidden');
      }
    });

    guestSelect.selectedIndex = guestSelect.querySelector('option:not(.hidden)').index; // первый не скрытый элемент из списка

  }

  function syncTimeInOut(timeField, value) {

    timeField.value = value;
  }

  function setMinPrice(field, price) {

    field.min = price;
  }

  function setAddress(x, y) {

    addressFiled.value = 'x: ' + x + ', y:' + y;
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

      fields.forEach(function (it) {
        it.disabled = able;
      });
    },
    setAddress: setAddress,
    setCallbackSubmitFunction: setCallbackSubmitFunction,
    clearForm: clearForm
  };

})();
