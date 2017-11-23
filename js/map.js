'user strict';

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

function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArrayElement(array) {

  var min = 0;
  var max = array.length;

  var randomId = generateRandomInt(min, max);

  return array[randomId];
}

function getOffer(x, y, currentNumber) {

  var offer = {};

  var minPrice = 1000;
  var maxPrice = 1000000;
  var minRoomCount = 1;
  var maxRoomCount = 5;
  var minGuestCount = 2;
  var maxGuestCount = 4;

  offer.title = OFFER_TITLES[currentNumber];
  offer.address = '' + x +',' + y;
  offer.price = generateRandomInt(minPrice, maxPrice + 1);
  offer.type = getRandomArrayElement(OFFER_TYPES);
  offer.rooms = generateRandomInt(minRoomCount, maxRoomCount + 1);
  offer.guests = generateRandomInt(minGuestCount, maxGuestCount + 1);
  offer.checkin = getRandomArrayElement(OFFER_CHECKS);
  offer.checkout = getRandomArrayElement(OFFER_CHECKS);

  return offer;
}

function getLocation() {

  var location = {};
  var minX = 300;
  var maxX = 900;
  var minY = 100;
  var maxY = 500;

  location.x = generateRandomInt(minX, maxX + 1); //что бы было включительно
  location.y = generateRandomInt(minY, maxY + 1);

  return location;
}

function generateAds(count) {

  var ad;
  var ads = [];
  var avatarPath = 'img/avatars/';
  var avatarPrefix = 'user';
  var avatarExtension = '.png';
  var currentNumber = 1;


  for (var i = 0; i < count; i++) {

    ad = {};

    ad.avatar = avatarPath + avatarPrefix + '0' + currentNumber + avatarExtension;

    ad.location = getLocation();
    ad.offer = getOffer(location.x, location.y, currentNumber);


    ads.push(ad);

    currentNumber++;
  }
var t = 0;
}

generateAds(3);