'use strict';

window.data = (function () {

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
    'bungalo',
    'palace'
  ];

  var MIN_PRICE = [
    1000,
    5000,
    0,
    10000
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

  var mapCardPoppupTemplate = document.querySelector('template').content.querySelector('article.map__card');

  function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function deleteFeature(articleFeatures, feature) {

    var featureClass = '.feature--' + feature;

    var nodeFeature = articleFeatures.querySelector(featureClass);

    nodeFeature.parentNode.removeChild(nodeFeature);
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

  function getAdArticle(ad) {

    var article = mapCardPoppupTemplate.cloneNode(true);

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

  function getRandomArrayElement(array) {

    var min = 0;
    var max = array.length;

    var randomId = generateRandomInt(min, max);

    return array[randomId];
  }

  function getRandomUniqueArray(array, count) {

    var copyArray = [];
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
    offer.description = '';
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

  return {

    createAd: function (number) {

      var ad = {};

      ad.author = getAvatar(number + 1);
      ad.location = getLocation();
      ad.offer = getOffer(ad.location.x, ad.location.y, number);

      return ad;
    },
    getAdArticle: getAdArticle,
    OFFER_CHECKS: OFFER_CHECKS,
    OFFER_TYPES: OFFER_TYPES,
    MIN_PRICE: MIN_PRICE
  };

})();
