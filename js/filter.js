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

  var HOUSING_TYPE_WEIGHT = 10;
  var HOUSING_PRICE_WEIGHT = 9;
  var ROOM_COUNT_WEIGHT = 8;
  var GUEST_COUNT_WEIGHT = 7;
  var FEATURE_WEIGHT = 1;

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

  var wifiName = 'wifi';
  var dishwasherName = 'dishwasher';
  var parkingName = 'parking';
  var washerName = 'washer';
  var elevatorName = 'elevator';
  var conditionerName = 'conditioner';

  var fullFilterWeight = 0;

  function getHouseTypeWeight(ad) {
    return ad.offer.type === houseTypeValue ? HOUSING_TYPE_WEIGHT : 0;
  }

  function getHousePriceWeight(ad) {

    switch (housePriceValue) {

      case 'middle':
        return (ad.offer.price >= MIDDLE_MIN_PRICE && ad.offer.price <= MIDDLE_MAX_PRICE) ? HOUSING_PRICE_WEIGHT : 0;

      case 'low':
        return ad.offer.price < LOW_PRICE ? HOUSING_PRICE_WEIGHT : 0;

      case 'high':
        return ad.offer.price > HIGH_PRICE ? HOUSING_PRICE_WEIGHT : 0;

      default:
        return 0;
    }
  }

  function getRoomCountWeight(ad) {
    return ad.offer.rooms === +houseRoomValue ? ROOM_COUNT_WEIGHT : 0;
  }

  function getGuestCountWeight(ad) {
    return ad.offer.guests === +houseGuestValue ? GUEST_COUNT_WEIGHT : 0;
  }

  function getFeaturesWeight(ad) {

    return getFeatusWeightIfExist(ad, wifiName, featuresWifi) +
           getFeatusWeightIfExist(ad, dishwasherName, featuresDishWasher) +
           getFeatusWeightIfExist(ad, parkingName, featuresParking) +
           getFeatusWeightIfExist(ad, washerName, featuresWasher) +
           getFeatusWeightIfExist(ad, elevatorName, featuresElevator) +
           getFeatusWeightIfExist(ad, conditionerName, featuresConditioner);
  }

  function getFeatusWeightIfExist(ad, name, weight) {

    var featureIndex = ad.offer.features.indexOf(name);

    return (featureIndex === -1) ? 0 : weight;
  }

  function getWeight(filterElement) {

    var theWeight = 0;

    theWeight += getHouseTypeWeight(filterElement);

    theWeight += getHousePriceWeight(filterElement);

    theWeight += getRoomCountWeight(filterElement);

    theWeight += getGuestCountWeight(filterElement);

    theWeight += getFeaturesWeight(filterElement);

    return theWeight;
  }

  function compareWeight(filterElement) {

    var elementWeight = getWeight(filterElement);

    if (elementWeight === fullFilterWeight) {
      return true;
    }

    return false;
  }

  function updateFullFilterWeight() {

    fullFilterWeight = 0;

    if (houseTypeValue !== NO_FILTER_VALUE) {
      fullFilterWeight += HOUSING_TYPE_WEIGHT;
    }

    if (housePriceValue !== NO_FILTER_VALUE) {
      fullFilterWeight += HOUSING_PRICE_WEIGHT;
    }

    if (houseRoomValue !== NO_FILTER_VALUE) {
      fullFilterWeight += ROOM_COUNT_WEIGHT;
    }

    if (houseGuestValue !== NO_FILTER_VALUE) {
      fullFilterWeight += GUEST_COUNT_WEIGHT;
    }

    fullFilterWeight += featuresWifi +
                        featuresDishWasher +
                        featuresParking +
                        featuresWasher +
                        featuresElevator +
                        featuresConditioner;
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

      updateFullFilterWeight();

      var sortedArray = array.filter(compareWeight);

      return sortedArray;

    }
  };
})();
