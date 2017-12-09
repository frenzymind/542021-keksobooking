'use strict';

window.data = (function () {

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

   return {

    createAd: function (number) {

      var ad = {};

      ad.author = getAvatar(number + 1);
      ad.location = getLocation();
      ad.offer = getOffer(ad.location.x, ad.location.y, number);

      return ad;
    }
  };

})();