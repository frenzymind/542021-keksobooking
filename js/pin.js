'use strict';

window.pin = (function() {

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
    //button.addEventListener('keydown', onPinKeyDown);

    return button;
  }

  return {

    createPinsFragment: function (ads) {

        var fragment = document.createDocumentFragment();

        for (var i = 0; i < ads.length; i++) {
          fragment.appendChild(createDomPinElement(ads[i], i));
        }

        return fragment;
    },
    setActivePinState: function (pin, state) {

      if (state === true) {
        pin.classList.add('map__pin--active');
      } else if (state === false) {
        pin.classList.remove('map__pin--active');
      }
    }
  };

})();
