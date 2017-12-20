'use strict';

window.filter = (function () {

  var HOUSING_TYPE_ID = 'housing-type';
  var HOUSING_PRICE_ID = 'housing-price';
  var HOUSING_ROOM_ID = 'housing-rooms'
  var HOUSING_GUEST_ID = 'housing-guests';

  var NO_FILTER_VALUE = 'any';

  var MIDDLE_MIN_PRICE = 10000;
  var MIDDLE_MAX_PRICE = 50000;

  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var houseTypeValue;
  var housePriceValue;
  var houseRoomValue;
  var houseGuestValue;
  var houseFeaturesValue;

  //var filtredArray;

  function filterHouseType(ad) {
    return ad.offer.type === houseTypeValue;
  }

  function filterHousePrice(ad) {

    switch (housePriceValue) {
      case 'middle': return (ad.offer.price >= MIDDLE_MIN_PRICE && ad.offer.price <= MIDDLE_MAX_PRICE);
      case 'low': return ad.offer.price <= LOW_PRICE;
      case 'high': return ad.offer.price >= HIGH_PRICE;
      default: return true;
    }

  }

  return {

    getFiltredArray: function (array, filterElement) {

      //filtredArray = array;

      if (filterElement.id === HOUSING_TYPE_ID) {
        houseTypeValue = filterElement.value;

        if (houseTypeValue !== NO_FILTER_VALUE) {
          array = array.filter(filterHouseType);
        }
      }

      if (filterElement.id === HOUSING_PRICE_ID) {
        housePriceValue = filterElement.value;

        if (housePriceValue !== NO_FILTER_VALUE) {
          array = array.filter(filterHousePrice);
        }
      }

      return array;

    }

  };

})();
