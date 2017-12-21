'use strict';

window.filter = (function () {

  var HOUSING_TYPE_ID = 'housing-type';
  var HOUSING_PRICE_ID = 'housing-price';
  var HOUSING_ROOM_ID = 'housing-rooms';
  var HOUSING_GUEST_ID = 'housing-guests';

  var FEATURES_WIFI_ID = 'filter-wifi';
  var FEATURES_DISH_WASHER_ID = 'filter-dishwasher';
  var FEATURES_PARKING_ID = 'filter-parking';
  var FEATURES_WASHER_ID = 'filter-washer';
  var FEATURES_ELEVATOR_ID = 'filter-elevator';
  var FEATURES_CONDITIONER_ID = 'filter-conditioner';

  var NO_FILTER_VALUE = 'any';

  var MIDDLE_MIN_PRICE = 10000;
  var MIDDLE_MAX_PRICE = 50000;

  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var houseTypeValue = NO_FILTER_VALUE;
  var housePriceValue = NO_FILTER_VALUE;
  var houseRoomValue = NO_FILTER_VALUE;
  var houseGuestValue = NO_FILTER_VALUE;

  var featuresWifi = 0;
  var featuresDishWasher = 0;
  var featuresParking = 0;
  var featuresWasher = 0;
  var featuresElevator = 0;
  var featuresConditioner = 0;

  var WifiName = 'wifi';
  var DishwasherName = 'dishwasher';
  var ParkingName = 'parking';
  var WasherName = 'washer';
  var ElevatorName = 'elevator';
  var ConditionerName = 'conditioner';

  function getHouseTypeWeight(ad) {
    return ad.offer.type === houseTypeValue ? 10 : 0;
  }

  function getHousePriceWeight(ad) {

    switch (housePriceValue) {

      case 'middle': return (ad.offer.price >= MIDDLE_MIN_PRICE && ad.offer.price <= MIDDLE_MAX_PRICE) ? 9 : 0;
      case 'low': return ad.offer.price <= LOW_PRICE ? 9 : 0;
      case 'high': return ad.offer.price >= HIGH_PRICE ? 9 : 0;
      default: return 0;
    }
  }

  function getRoomCountWeight(ad) {
    return ad.offer.rooms === +houseRoomValue ? 8 : 0;
  }

  function getGuestCountWeight(ad) {
    return ad.offer.guests === +houseGuestValue ? 7 : 0;
  }

  function getFeaturesWeight(ad) {

    return getFeatusWeightIfExist(ad, WifiName, featuresWifi) +
           getFeatusWeightIfExist(ad, DishwasherName, featuresDishWasher) +
           getFeatusWeightIfExist(ad, ParkingName, featuresParking) +
           getFeatusWeightIfExist(ad, WasherName, featuresWasher) +
           getFeatusWeightIfExist(ad, ElevatorName, featuresElevator) +
           getFeatusWeightIfExist(ad, ConditionerName, featuresConditioner);
  }

  function getFeatusWeightIfExist(ad, name, weight) {

    var featureIndex = ad.offer.features.indexOf(name);

    if (featureIndex === -1) {
      return 0;
    }

    return weight;
  }

  function getWeight(left, right) {

    var theRightWeight = 0;
    var theLeftWeight = 0;

    theLeftWeight += getHouseTypeWeight(left);
    theRightWeight += getHouseTypeWeight(right);

    theLeftWeight += getHousePriceWeight(left);
    theRightWeight += getHousePriceWeight(right);

    theLeftWeight += getRoomCountWeight(left);
    theRightWeight += getRoomCountWeight(right);

    theLeftWeight += getGuestCountWeight(left);
    theRightWeight += getGuestCountWeight(right);

    theLeftWeight += getFeaturesWeight(left);
    theRightWeight += getFeaturesWeight(right);

    return theRightWeight - theLeftWeight;

  }

  return {

    getFiltredArray: function (array, filterElement) {

      switch (filterElement.id) {

        case HOUSING_TYPE_ID:
          houseTypeValue = filterElement.value;
          break;

        case HOUSING_PRICE_ID:
          housePriceValue = filterElement.value;
          break;

        case HOUSING_ROOM_ID:
          houseRoomValue = filterElement.value;
          break;

        case HOUSING_GUEST_ID:
          houseGuestValue = filterElement.value;
          break;

        case FEATURES_WIFI_ID:
          featuresWifi = +filterElement.checked;
          break;

        case FEATURES_DISH_WASHER_ID:
          featuresDishWasher = +filterElement.checked;
          break;

        case FEATURES_PARKING_ID:
          featuresParking = +filterElement.checked;
          break;

        case FEATURES_WASHER_ID:
          featuresWasher = +filterElement.checked;
          break;

        case FEATURES_ELEVATOR_ID:
          featuresElevator = +filterElement.checked;
          break;

        case FEATURES_CONDITIONER_ID:
          featuresConditioner = +filterElement.checked;
          break;

      }

      var sortedArray = array.slice().sort(getWeight);

      return sortedArray;

    }
  };
})();
