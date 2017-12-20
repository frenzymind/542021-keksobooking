'use strict';

window.filter = (function () {

  var HOUSING_TYPE_ID = 'housing-type';

  var NO_FILTER_VALUE = 'any';

  var houseTypeValue;
  var housePriceValue;
  var houseRoomValue;
  var houseGuestValue;
  var houseFeaturesValue;

  var filtredArray;

  function filterHouseType(ad) {
    return ad.offer.type === houseTypeValue;
  }

  return {

    getFiltredArray: function (array, filterElement) {

      filtredArray = array;

      if (filterElement.id === HOUSING_TYPE_ID) {
        houseTypeValue = filterElement.value;

        if (houseTypeValue !== NO_FILTER_VALUE) {
          filtredArray = filtredArray.filter(filterHouseType);
        }
      }

      return filtredArray;

    }

  };

})();
