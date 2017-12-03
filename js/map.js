'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var OBJECTS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var MAX_ROOMS = 5;
var GUEST_NUMBER = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var PINS_NUMBER = 8;
var PIN_X = 46;
var PIN_Y = 62;

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
  bungalo: 'Бунгало'
};

var allObjects = []; // объекты недвижимости
var offers = OBJECTS.slice();
var mainMap = document.querySelector('.map');
var pinsContainer = mainMap.querySelector('.map__pins');
var mapElementTemplate = document.querySelector('template').content.querySelector('.map__card');
var mapElement = mapElementTemplate.cloneNode(true);
var mapElementLine = mapElement.querySelectorAll('p');
var mapElementUl = mapElement.querySelector('.popup__features');
var pinMain = mainMap.querySelector('.map__pin--main');
var mapTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapElementClose = mapElement.querySelector('.popup__close');
var fragment = document.createDocumentFragment();
var fragmentPiece = document.createDocumentFragment();
var noticeForm = document.querySelector('.notice__form');
var actualPin = false;

var pinX = function (x) {
  return (x - PIN_X / 2) + 'px';
};
var pinY = function (y) {
  return (y - PIN_Y) + 'px';
};

var getPosts = function (number) {
  for (var i = 0; i < number; i++) {
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
};

var showPins = function (post, i) {
  var pin = mapTemplate.cloneNode(true);
  pin.querySelector('img').src = post.author.avatar;
  pin.style.left = pinX(post.location.x);
  pin.style.top = pinY(post.location.y);
  pin.dataset.numPin = i;
  fragment.appendChild(pin);
  return pin;
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

var showString = function (element) {
  return '<li class="feature feature--' + element + '"></li>';
};

var getCard = function (post) {
  mapElement.querySelector('img').src = post.author.avatar;
  mapElement.querySelector('h3').textContent = post.offer.title;
  mapElement.querySelector('.popup__price').innerHTML = post.offer.price + '&#x20bd;/ночь';
  mapElement.querySelector('small').textContent = post.offer.address;
  mapElement.querySelector('h4').textContent = places[post.offer.type];
  mapElementLine[2].textContent = post.offer.rooms + ' Комнаты для ' + post.offer.guests + ' гостей';
  mapElementLine[3].textContent = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;
  mapElementLine[4].textContent = post.offer.description;
  mapElementUl.innerHTML = '';
  mapElementUl.insertAdjacentHTML('afterBegin', post.offer.features.map(showString).join(' '));
  mapElement.appendChild(mapElementUl);
  return mapElement;
};

var startPage = function () { // начало работы с картой
  mainMap.classList.remove('map--faded');
  pinsContainer.appendChild(fragment);
  noticeForm.classList.remove('notice__form--disabled');
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  mapElement.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  mapElement.classList.add('hidden');
  if (actualPin !== false) {
    actualPin.classList.remove('map__pin--active');
    actualPin = false;
  }
  document.removeEventListener('keydown', onPopupEscPress);
};

var getRandomValue = function (max, min) {

  return Math.floor(Math.random() * (max - min)) + min;
};

allObjects = getPosts(PINS_NUMBER);
allObjects.forEach(showPins);
fragmentPiece.appendChild(getCard(allObjects[0]));
mainMap.appendChild(fragmentPiece);
mapElement.classList.add('hidden');

pinMain.addEventListener('mouseup', function () {
  startPage();
});

pinsContainer.addEventListener('click', function (event) {
  var point = event.target;
  while (point !== pinsContainer) {
    if (point.tagName === 'BUTTON') {
      if (actualPin !== false) {
        actualPin.classList.remove('map__pin--active');
      }
      point.classList.add('map__pin--active');
      actualPin = point;
      if (!point.classList.contains('map__pin--main')) {
        // Заполняем DOM-ноду карточки данными из массива объектов
        getCard(allObjects[point.dataset.numPin]);
        openPopup();
      }
      return;
    }
    point = point.parentNode;
  }
});

mapElementClose.addEventListener('click', function () {
  closePopup();
});

mapElementClose.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});
