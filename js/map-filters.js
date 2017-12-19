'use strict';
window.mapFilters = (function () {

  var PINS_LIMIT = 5;

  var objects = {
    houseType: 'any',
    housePrice: 'any',
    houseRooms: 'any',
    houseGuests: 'any'
  };

  var mapFilter = document.querySelector('.map__filters');
  var typeFilter = mapFilter.querySelector('#housing-type');
  var filterPrice = mapFilter.querySelector('#housing-price');
  var filterRooms = mapFilter.querySelector('#housing-rooms');
  var filterGuests = mapFilter.querySelector('#housing-guests');
  var pinsContainer = document.querySelector('.map__pins');
  var newData = [];

  var showSimilarPins = function (arr) {
    var pinsFragment = document.createDocumentFragment();
    var newArr = arr;
    if (objects.houseType !== 'any') {
      newArr = newArr.filter(function (element) {
        return element.offer.type === objects.houseType;
      });
    }
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
    if (objects.houseRooms !== 'any') {
      newArr = newArr.filter(function (element) {
        return element.offer.rooms === parseInt(objects.houseRooms, 10);
      });
    }
    if (objects.houseGuests !== 'any') {
      newArr = newArr.filter(function (element) {
        return element.offer.guests === parseInt(objects.houseGuests, 10);
      });
    }
    if (newArr.length > PINS_LIMIT) {
      newArr = newArr.slice(0, PINS_LIMIT);
    }
    newArr.forEach(window.pin.render, pinsFragment);
    pinsContainer.innerHTML = '';
    pinsContainer.appendChild(pinsFragment);
  };
  var onTypeChange = function (evt) {
    objects.houseType = evt.target.value;
    showSimilarPins(newData);
  };
  var onPriceChange = function (evt) {
    objects.housePrice = evt.target.value;
    showSimilarPins(newData);
  };
  var onRoomsChange = function (evt) {
    objects.houseRooms = evt.target.value;
    showSimilarPins(newData);
  };
  var onGuestsChange = function (evt) {
    objects.houseGuests = evt.target.value;
    showSimilarPins(newData);
  };

  typeFilter.addEventListener('change', onTypeChange);
  filterPrice.addEventListener('change', onPriceChange);
  filterRooms.addEventListener('change', onRoomsChange);
  filterGuests.addEventListener('change', onGuestsChange);

  return {
    sample: function (arr) {
      newData = arr.slice();
      return newData.slice(0, PINS_LIMIT);
    }
  };
})();
