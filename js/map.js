'use strict';

window.map = (function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var PIN_MAIN_CLASS = 'map__pin--main';
  var PIN_MAIN_TOP_BORDER = 100;
  var PIN_MAIN_BOT_BORDER = 500;

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
    document.addEventListener('mousedown', onMainPinMousedown);
  }

  function onMainPinMousedown(evt) {

    var mainPin = getClosestPin(evt.target);

    if (!isItMainPin(mainPin)) {
      return;
    }

    var mapOffsetX = document.querySelector('.map').offsetLeft;

    function onMouseMove(moveEvt) {

      var newY = moveEvt.pageY;

      if (newY < PIN_MAIN_TOP_BORDER) {
        newY = PIN_MAIN_TOP_BORDER;
      } else if (newY > PIN_MAIN_BOT_BORDER) {
        newY = PIN_MAIN_BOT_BORDER;
      }

      mapMainPin.style.left = moveEvt.pageX - mapOffsetX + 'px';
      mapMainPin.style.top = newY + 'px';

      var coord = getMainPinAddressCoord();
      window.form.setAddress(coord.x, coord.y);
    }

    function onMouseUp(upEvt) {

      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    function getMainPinAddressCoord() {

      var correctY = 44;

      return {
        x: mapMainPin.offsetLeft,
        y: mapMainPin.offsetTop + correctY
      };
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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

    if (domElement === null || domElement.classList.contains(PIN_MAIN_CLASS) === true) { // если это не пин или это главный пин, то не реагируем
      return false;
    }

    return true;
  }

  function isItMainPin(domElement) {

    if (domElement === null || domElement.classList.contains(PIN_MAIN_CLASS) === false) {
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

    var article = window.data.getAdArticle(ad);

    window.show_card.showPopupAdArticle(article);
    window.pin.setPinOn(pin);
    setCurrentArticleCloseButtonEvents(article);
  }

  function closePinAd() {

    window.show_card.closePopupAdArticle();
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
