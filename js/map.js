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

var map;
var mapPins;
var adNoticeForm;
var mapMainPin;
var ads;
var activePin = false;
var mapCardPoppupTemplate;
var nodeBefore;
var nodeBeforeInsert;
var currentArticle = false;
var popupCloseButton;

function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArrayElement(array) {

  var min = 0;
  var max = array.length;

  var randomId = generateRandomInt(min, max);

  return array[randomId];
}

function getRandomUniqueArray(array, count) {

  var copyArray = []; // я прав, что после выхода из функции он уничтожится ?
  var uniqueArray = [];

  for (var i = 0; i < array.length; i++) {
    copyArray[i] = array[i];
  }

  for (i = 0; i < count; i++) {

    uniqueArray[i] = getRandomArrayElement(copyArray);
    copyArray.splice(copyArray.indexOf(uniqueArray[i]), 1);
  }

  return uniqueArray;
}

function getOffer(x, y, currentNumber) {

  var offer = {};

  var minPrice = 1000;
  var maxPrice = 1000000;
  var minRoomCount = 1;
  var maxRoomCount = 5;
  var minGuestCount = 2;
  var maxGuestCount = 4;
  var featuresCount = generateRandomInt(0, OFFER_FEATURES.length);

  offer.title = OFFER_TITLES[currentNumber];
  offer.address = '' + x + ',' + y;
  offer.price = generateRandomInt(minPrice, maxPrice + 1);
  offer.type = getRandomArrayElement(OFFER_TYPES);
  offer.rooms = generateRandomInt(minRoomCount, maxRoomCount + 1);
  offer.guests = generateRandomInt(minGuestCount, maxGuestCount + 1);
  offer.checkin = getRandomArrayElement(OFFER_CHECKS);
  offer.checkout = getRandomArrayElement(OFFER_CHECKS);
  offer.features = getRandomUniqueArray(OFFER_FEATURES, featuresCount);
  offer.description = '123';
  offer.photos = [];

  return offer;
}

function getLocation() {

  var location = {};
  var minX = 300;
  var maxX = 900;
  var minY = 100;
  var maxY = 500;

  location.x = generateRandomInt(minX, maxX + 1); // что бы было включительно
  location.y = generateRandomInt(minY, maxY + 1);

  return location;
}

function getAvatar(currentNumber) {

  var avatarObj = {};

  var avatarPath = 'img/avatars/';
  var avatarPrefix = 'user';
  var avatarExtension = '.png';

  avatarObj.avatar = avatarPath + avatarPrefix + '0' + currentNumber + avatarExtension;

  return avatarObj;
}

function createAd(number) {

  var ad = {};

  ad.author = getAvatar(number + 1);
  ad.location = getLocation();
  ad.offer = getOffer(ad.location.x, ad.location.y, number);

  return ad;
}

function generateAds(count) {

  ads = [];
  var currentNumber = 0;

  for (var i = 0; i < count; i++, currentNumber++) {

    ads.push(createAd(currentNumber));
  }

  return ads;
}

function scaleX(x) {

  var mapPinXCorrection = -20;

  return x + mapPinXCorrection;
}

function scaleY(y) {

  var mapPinYCorrection = -22;

  return y + mapPinYCorrection;
}

function createDomPinElement(ad, index) {

  var button = document.createElement('button');
  button.style.left = scaleX(ad.location.x) + 'px';
  button.style.top = scaleY(ad.location.y) + 'px';
  button.classList.add('map__pin');
  button.dataset.adIndex = index;

  var img = document.createElement('img');
  img.src = ad.author.avatar;
  img.width = 40;
  img.height = 40;
  img.draggable = false;

  button.appendChild(img);
  button.addEventListener('keydown', onPinKeyDown);

  return button;
}

function createPinsFragment() {

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createDomPinElement(ads[i], i));
  }

  return fragment;
}

function getHousingByType(type) {

  var housing;

  switch (type) {

    case 'flat':
      housing = 'Квартира';
      break;

    case 'bungalo':
      housing = 'Бунгало';
      break;

    case 'house':
      housing = 'Дом';
      break;

    default : housing = 'Неизвестный тип жилья';
  }

  return housing;
}

function deleteFeature(articleFeatures, feature) {

  var featureClass = '.feature--' + feature;

  var nodeFeature = articleFeatures.querySelector(featureClass);

  nodeFeature.parentNode.removeChild(nodeFeature);
}

function getAdArticle(ad, template) {

  var article = template.cloneNode(true);

  article.querySelector('h3').textContent = ad.offer.title;
  article.querySelector('p small').textContent = ad.offer.address;
  article.querySelector('p.popup__price').innerHTML = ad.offer.price + ' &#x20bd; /ночь';
  article.querySelector('h4').textContent = getHousingByType(ad.offer.type);
  article.querySelector('p:nth-of-type(3)').textContent = ad.offer.rooms + ' для ' + ad.offer.guests + ' гостей';
  article.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var articleDomFeatures = article.querySelector('ul');

  for (var i = 0; i < OFFER_FEATURES.length; i++) {

    var featureIndex = ad.offer.features.indexOf(OFFER_FEATURES[i]);

    if (featureIndex === -1) {
      deleteFeature(articleDomFeatures, OFFER_FEATURES[i]);
    }
  }

  article.querySelector('p:nth-of-type(5)').textContent = ad.offer.description;
  article.querySelector('ul.popup__pictures li img').attributes.src.value = ad.author.avatar;

  return article;
}

function setNoticeFormDisable(noticeForm, able) {

  var formDisableClass = 'notice__form--disabled';

  if (able === false) {
    adNoticeForm.classList.remove(formDisableClass);
  } else {
    adNoticeForm.classList.add(formDisableClass);
  }

  var fields = noticeForm.querySelectorAll('fieldset');

  for (var i = 0; i < fields.length; i++) {

    fields[i].disabled = able;
  }
}

function mapMainPinBegin() {

  map.classList.remove('map--faded');
  document.addEventListener('click', onMapPinClick);
}

function onMainPinMouseUp() {

  mapMainPinBegin();
  setNoticeFormDisable(adNoticeForm, false);
  showAds();
}

function onPinKeyDown(evt) {

  if (evt.keyCode === ENTER_KEYCODE) {

    var ad = getAdByIndex(evt.target.dataset.adIndex);

    if (currentArticle === false) {
      openPopupAdArticle(ad);
    } else {
      replacePopupAdArticle(ad);
    }
  }
}

function onMapPinClick(evt) {

  var pinClass = 'map__pin';
  var pinMainClass = 'map__pin--main';

  if (evt.target.classList.contains(pinClass) === false || evt.target.classList.contains(pinMainClass) === true) { // если это не пин или это главный пин, то не реагируем
    return;
  }

  if (activePin !== false) { // если был активный пин, снимаем с него класс активности
    setActivePinState(false);
  }

  activePin = evt.target;
  setActivePinState(true);

  var ad = getAdByIndex(activePin.dataset.adIndex);

  if (currentArticle === false) {
    openPopupAdArticle(ad);
  } else {
    replacePopupAdArticle(ad);
  }
}

function setActivePinState(state) {

  if (state === true) {
    activePin.classList.add('map__pin--active');
  } else if (state === false) {
    activePin.classList.remove('map__pin--active');
  }
}

function onClosePopupClick() {

  closePopupAdArticle();
}

function onClosePopupKeyDown(evt) {

  if (evt.keyCode === ENTER_KEYCODE) {
    closePopupAdArticle();
  }
}

function onPopupKeyDown(evt) {

  if (evt.keyCode === ESC_KEYCODE) {
    closePopupAdArticle();
  }
}

function setPopupCloseButtonEvents() {

  popupCloseButton = currentArticle.querySelector('.popup__close');
  popupCloseButton.addEventListener('click', onClosePopupClick);
  popupCloseButton.addEventListener('keydown', onClosePopupKeyDown);

  document.addEventListener('keydown', onPopupKeyDown);
}

function openPopupAdArticle(ad) {

  currentArticle = getAdArticle(ad, mapCardPoppupTemplate);

  setPopupCloseButtonEvents();

  nodeBefore.insertBefore(currentArticle, nodeBeforeInsert);
}

function closePopupAdArticle() {

  nodeBefore.removeChild(currentArticle);
  currentArticle = false;
  setActivePinState(false);
  activePin = false;

  document.removeEventListener('keydown', onPopupKeyDown);
}

function replacePopupAdArticle(ad) {

  var bufferArticle = getAdArticle(ad, mapCardPoppupTemplate);
  nodeBefore.replaceChild(bufferArticle, currentArticle);

  currentArticle = bufferArticle;

  setPopupCloseButtonEvents();
}

function getAdByIndex(index) {
  return ads[index];
}

function init() {

  map = document.querySelector('.map');
  mapPins = document.querySelector('.map__pins');
  adNoticeForm = document.querySelector('form.notice__form');
  mapMainPin = document.querySelector('.map__pin--main');

  mapCardPoppupTemplate = document.querySelector('template').content.querySelector('article.map__card');

  nodeBeforeInsert = document.querySelector('.map__filters-container');
  nodeBefore = nodeBeforeInsert.parentNode;

  setNoticeFormDisable(adNoticeForm, true);

  mapMainPin.addEventListener('mouseup', onMainPinMouseUp);
}

function showAds() {

  if (typeof ads !== 'undefined') {
    return;
  }

  var adsCount = 8;

  ads = generateAds(adsCount);

  var fragmentPins = createPinsFragment();

  mapPins.appendChild(fragmentPins);
}

init();
