﻿'use strict';
window.mapFilters = (function () {

  var PINS_LIMIT = 5;

  var objects = {
    houseType: 'any',
    housePrice: 'any',
    houseRooms: 'any',
    houseGuests: 'any'
  };

  var objChecked = {
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false
  };

  var mapFilter = document.querySelector('.map__filters');
  var typeFilter = mapFilter.querySelector('#housing-type');
  var priceFilter = mapFilter.querySelector('#housing-price');
  var roomsFilter = mapFilter.querySelector('#housing-rooms');
  var guestsFilter = mapFilter.querySelector('#housing-guests');
  var featuresFilter = mapFilter.querySelector('#housing-features');
  var wifiFeature = featuresFilter.querySelector('#filter-wifi');
  var dishwasherFeature = featuresFilter.querySelector('#filter-dishwasher');
  var parkingFeature = featuresFilter.querySelector('#filter-parking');
  var washerFeature = featuresFilter.querySelector('#filter-washer');
  var liftFeature = featuresFilter.querySelector('#filter-elevator');
  var conditionerFeature = featuresFilter.querySelector('#filter-conditioner');
  var newData = [];

  var showHouse = function (newArr) {
    if (objects.houseType !== 'any') {
      newArr = newArr.filter(function (element) {
        return element.offer.type === objects.houseType;
      });
    }
    return newArr;
  };

  var showPrice = function (newArr) {
    switch (objects.housePrice) {
      case 'any':
        break;
      case 'low':
        newArr = newArr.filter(function (element) {
          return element.offer.price <= 10000;
        });
        break;
      case 'high':
        newArr = newArr.filter(function (element) {
          return element.offer.price >= 50000;
        });
        break;
      case 'middle':
        newArr = newArr.filter(function (element) {
          return (element.offer.price > 10000) && (element.offer.price < 50000);
        });
    }
    return newArr;
  };
  var showRooms = function (newArr) {
    if (objects.houseRooms !== 'any') {
      newArr = newArr.filter(function (element) {
        return element.offer.rooms === parseInt(objects.houseRooms, 10);
      });
    }
    return newArr;
  };
  var showGuests = function (newArr) {
    if (objects.houseGuests !== 'any') {
      newArr = newArr.filter(function (element) {
        return element.offer.guests === parseInt(objects.houseGuests, 10);
      });
    }
    return newArr;
  };
  var showFeatures = function (newArr) {
    var filterSet = false;
    for (var key in objChecked) {
      if (objChecked[key]) {
        newArr = newArr.filter(function (element) {
          filterSet = false;
          for (var i = 0; i < element.offer.features.length; i++) {
            if (element.offer.features[i] === key) {
              filterSet = true;
              break;
            }
          }
          return filterSet;
        });
      }
    }
    return newArr;
  };

  var onTypeChange = function (evt) {
    objects.houseType = evt.target.value;
    window.mapFilters.updateData(newData);
  };
  var onPriceChange = function (evt) {
    objects.housePrice = evt.target.value;
    window.mapFilters.updateData(newData);
  };
  var onRoomsChange = function (evt) {
    objects.houseRooms = evt.target.value;
    window.mapFilters.updateData(newData);
  };
  var onGuestsChange = function (evt) {
    objects.houseGuests = evt.target.value;
    window.mapFilters.updateData(newData);
  };

  var onFeaturesChange = function () {
    objChecked.wifi = wifiFeature.checked;
    objChecked.dishwasher = dishwasherFeature.checked;
    objChecked.parking = parkingFeature.checked;
    objChecked.washer = washerFeature.checked;
    objChecked.elevator = liftFeature.checked;
    objChecked.conditioner = conditionerFeature.checked;
    window.mapFilters.updateData(newData);
  };

  typeFilter.addEventListener('change', onTypeChange);
  priceFilter .addEventListener('change', onPriceChange);
  roomsFilter.addEventListener('change', onRoomsChange);
  guestsFilter.addEventListener('change', onGuestsChange);
  featuresFilter.addEventListener('click', onFeaturesChange);

  return {
    sample: function (newArr) {
      newData = newArr.slice();
      return newData.slice(0, PINS_LIMIT);
    },
    updateData: function (newArr) {
      var filteredData = newArr;
      filteredData = showHouse(filteredData);
      filteredData = showPrice(filteredData);
      filteredData = showRooms(filteredData);
      filteredData = showGuests(filteredData);
      filteredData = showFeatures(filteredData);
      if (filteredData.length > PINS_LIMIT) {
        filteredData = filteredData.slice(0, PINS_LIMIT);
      }
      return filteredData;
    }
  };
})();