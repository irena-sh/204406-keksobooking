'use strict';

window.data = (function () {
  var OBJECTS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['flat', 'house', 'bungalo', 'palace'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var MAX_ROOMS = 5;
  var GUEST_NUMBER = 10;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var PINS_NUMBER = 8;

  var coordinates = {
    x: {
      min: 300,
      max: 900
    },
    y: {
      min: 100,
      max: 500
    }
  };

  var places = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
    palace: 'Дворец'
  };

  var offerPrice = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };

  var allObjects = []; // объекты недвижимости
  var offers = OBJECTS.slice();

  var getRandomValue = function (max, min) {

    return Math.floor(Math.random() * (max - min)) + min;
  };

  var createFeatures = function () {
    var offerFeatures = OFFER_FEATURES.slice();
    var lengthArrRandom = getRandomValue(Math.round(offerFeatures.length / 2), offerFeatures.length);
    var newFeatures = [];
    for (var i = 0; i <= lengthArrRandom; i++) {
      var randomIndex = getRandomValue(0, offerFeatures.length);
      newFeatures[i] = offerFeatures.splice(randomIndex, 1);
    }
    return newFeatures;
  };
  return {
    placeType: TYPES.slice(),
    placesValue: TYPES.map(function (elem) {
      return places[elem];
    }),
    arrPrices: TYPES.map(function (elem) {
      return offerPrice[elem];
    }),
    arrOfferChecks: TIMES.slice(),

    getPosts: function () {
      for (var i = 0; i < PINS_NUMBER; i++) {
        var locationX = getRandomValue(coordinates.x.min, coordinates.x.max);
        var locationY = getRandomValue(coordinates.y.min, coordinates.y.max);
        allObjects[i] = {
          author: {
            avatar: 'img/avatars/user0' + (i + 1) + '.png',
          },
          offer: {
            title: offers.splice(getRandomValue(0, offers.length), 1),
            address: locationX + ', ' + locationY,
            price: getRandomValue(MIN_PRICE, MAX_PRICE),
            type: TYPES[getRandomValue(0, TYPES.length)],
            rooms: getRandomValue(1, MAX_ROOMS),
            guests: getRandomValue(1, GUEST_NUMBER),
            checkin: TIMES[getRandomValue(0, TIMES.length)],
            checkout: TIMES[getRandomValue(0, TIMES.length)],
            features: createFeatures(),
            description: '',
            photos: []
          },
          location: {
            x: locationX,
            y: locationY
          }
        };
      }
      return allObjects;
    },
  };
})();
