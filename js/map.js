'use strict';

var OFFER_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
];

var OFFER_TYPES = [
    'flat',
    'house',
    'bungalo'
];

var OFFER_CHECKS = [
    '12:00',
    '13:00',
    '14:00'
];

var OFFER_FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
];

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

window.map = (function () {

var mainMap;
var mapPins;
var mapMainPin;
var ads;
var popupCloseButton;

function generateAds(count) {

  ads = [];
  var currentNumber = 0;

  for (var i = 0; i < count; i++, currentNumber++) {

    ads.push(window.data.createAd(currentNumber));
  }

  return ads;
}

function mapMainPinBegin() {

  mainMap.classList.remove('map--faded');
  document.addEventListener('click', onMapPinClick);
  document.addEventListener('keydown', onPinKeyDown);
}

function onMainPinMouseUp() {

  mapMainPinBegin();
  window.form.setNoticeFormDisable(false);
  showAds();
}

function onPinKeyDown(evt) {

  if (evt.keyCode === ENTER_KEYCODE) {

    var closerElement = getClosestPin(evt.target);

    if (!isItPin(closerElement)) {
      return;
    }

    openPinAd(closerElement);
  }
}

function isItPin(domElement) {

  var pinMainClass = 'map__pin--main';

  if (domElement === null || domElement.classList.contains(pinMainClass) === true) { // если это не пин или это главный пин, то не реагируем
    return false;
  }

  return true;
}

  function getClosestPin(domElement) {

    var closest = domElement.closest('button.map__pin.map__pin--main') || domElement.closest('button.map__pin');

    return closest;
  }

  function onMapPinClick(evt) {

    var closerElement = getClosestPin(evt.target);

    if (!isItPin(closerElement)) {
      return;
    }

    openPinAd(closerElement);
  }

  function openPinAd(pin) {

    var ad = getAdByIndex(pin.dataset.adIndex);

    var article = window.card.showPopupAdArticle(ad);
    window.pin.setPinOn(pin);
    setCurrentArticleCloseButtonEvents(article);
  }

  function closePinAd() {

    window.card.closePopupAdArticle();
    window.pin.setPinOff();

    document.removeEventListener('keydown', onPopupKeyDown);
  }

  function onClosePopupClick() {

    closePinAd();
  }

  function onClosePopupKeyDown(evt) {

    if (evt.keyCode === ENTER_KEYCODE) {

      closePinAd();
    }
  }

  function onPopupKeyDown(evt) {

    if (evt.keyCode === ESC_KEYCODE) {

      closePinAd();
    }
  }

  function setCurrentArticleCloseButtonEvents(article) {

    popupCloseButton = article.querySelector('.popup__close');
    popupCloseButton.addEventListener('click', onClosePopupClick);
    popupCloseButton.addEventListener('keydown', onClosePopupKeyDown);

    document.addEventListener('keydown', onPopupKeyDown);
  }

  function getAdByIndex(index) {
    return ads[index];
  }

  function init() {

    mainMap = document.querySelector('.map');
    mapPins = document.querySelector('.map__pins');
    mapMainPin = document.querySelector('.map__pin--main');

    mapMainPin.addEventListener('mouseup', onMainPinMouseUp);
  }

  function showAds() {

    if (typeof ads !== 'undefined') {
      return;
    }

    var adsCount = 8;

    ads = generateAds(adsCount);

    var fragmentPins = window.pin.createPinsFragment(ads);

    mapPins.appendChild(fragmentPins);
  }

  init();

})();