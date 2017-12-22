'use strict';

window.data = (function () {

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

  return {

    getAdArticle: getAdArticle,
    OFFER_CHECKS: OFFER_CHECKS,
    OFFER_TYPES: OFFER_TYPES,
    MIN_PRICE: MIN_PRICE
  };

})();
