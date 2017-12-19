'use strict';

window.pin = (function () {

  var activePin = false;

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

    return button;
  }

  return {

    createPinsFragment: function (ads, pinCount) {

      var count = pinCount || ads.length;
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < count; i++) {
        fragment.appendChild(createDomPinElement(ads[i], i));
      }

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

      activePin.classList.remove('map__pin--active');
      activePin = false;
    }
  };

})();
