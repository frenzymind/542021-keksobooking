'use strict';

window.pin = (function () {

  var MAP_PIN_X_CORRECTION = -20;
  var MAP_PIN_Y_CORRECTION = -22;

  var activePin = false;

  function scaleX(x) {

    return x + MAP_PIN_X_CORRECTION;
  }

  function scaleY(y) {

    return y + MAP_PIN_Y_CORRECTION;
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

    return button;
  }

  return {

    createPinsFragment: function (ads, pinCount) {

      var count = ads.length > pinCount ? pinCount : ads.length;
      var fragment = document.createDocumentFragment();

      ads.filter(function (it, index) {
        return index < count ? true : false;
      }).forEach(function (it, index) {
        fragment.appendChild(createDomPinElement(it, index));
      });

      return fragment;
    },
    setPinOn: function (pin) {

      if (activePin !== false) { // если был активный пин, снимаем с него класс активности
        activePin.classList.remove('map__pin--active');
      }

      activePin = pin;

      activePin.classList.add('map__pin--active');

    },
    setPinOff: function () {

      if (activePin !== false) {
        activePin.classList.remove('map__pin--active');
        activePin = false;
      }
    }
  };

})();
