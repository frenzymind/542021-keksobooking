'use strict';

(function () {

  var mapCardPoppupTemplate = document.querySelector('template').content.querySelector('article.map__card');
  var nodeBeforeInsert = document.querySelector('.map__filters-container');
  var nodeBefore = nodeBeforeInsert.parentNode;
  var popupCloseButton;

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

  function onClosePopupClick() {

    closePopupAdArticle();
    setActivePinState(false);
    activePin = false;
  }

  function onClosePopupKeyDown(evt) {

    if (evt.keyCode === ENTER_KEYCODE) {
      closePopupAdArticle();
      /*setActivePinState(false);
      activePin = false;*/
    }
  }

  function onPopupKeyDown(evt) {

    if (evt.keyCode === ESC_KEYCODE) {
      closePopupAdArticle();
      /*setActivePinState(false);
      activePin = false;*/
    }
  }

  function setPopupCloseButtonEvents() {

    popupCloseButton = currentArticle.querySelector('.popup__close');
    popupCloseButton.addEventListener('click', onClosePopupClick);
    popupCloseButton.addEventListener('keydown', onClosePopupKeyDown);

    document.addEventListener('keydown', onPopupKeyDown);
  }

  window.card = {

    openPopupAdArticle : function (ad) {

      currentArticle = getAdArticle(ad);

      setPopupCloseButtonEvents();

      nodeBefore.insertBefore(currentArticle, nodeBeforeInsert);
    },

    closePopupAdArticle : function () {

      nodeBefore.removeChild(currentArticle);
      currentArticle = false;
      /*setActivePinState(false);
      activePin = false;*/

      document.removeEventListener('keydown', onPopupKeyDown);
    },

    replacePopupAdArticle : function (ad) {

      var bufferArticle = getAdArticle(ad);
      nodeBefore.replaceChild(bufferArticle, currentArticle);

      currentArticle = bufferArticle;

      setPopupCloseButtonEvents();
    }
  };

})();