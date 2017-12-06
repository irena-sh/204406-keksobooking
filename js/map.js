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
  bungalo: 'Бунгало',
  palace: 'Дворец'
};

var offerPrice = {
  flat: 1000,
  bungalo: 0,
  house: 5000,
  palace: 10000
};

var roomsAccordance = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  100: [0]
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
var noticeForm = document.querySelector('.notice__form');
var actualPin = false;

var pinX = function (x) {
  return x + 'px';
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

var getRandomValue = function (max, min) {

  return Math.floor(Math.random() * (max - min)) + min;
};

var startPage = function () { // начало работы с картой
  mainMap.classList.remove('map--faded');
  pinsContainer.appendChild(fragment);
  noticeForm .classList.remove('notice__form--disabled');
};

var onPopupEscPress = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var hidePin = function () {
  if (actualPin !== false) {
    actualPin.classList.remove('map__pin--active');
  }
};

var openPopup = function () {
  mapElement.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  mapElement.classList.add('hidden');
  hidePin();
  actualPin = false;
  document.removeEventListener('keydown', onPopupEscPress);
};

var closePinMouse = function () { // закрыть мышкой
  closePopup();
};

var onEnterClosePin = function (event) { // закрыть клавишей
  if (event.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
};

var clickPin = function (event) {
  var activeElement = event.target;
  while (activeElement !== pinsContainer) {
    if (activeElement.tagName === 'BUTTON') {
      hidePin();
      activeElement.classList.add('map__pin--active');
      actualPin = activeElement;
      if (!activeElement.classList.contains('map__pin--main')) {
        getCard(allObjects[activeElement.dataset.numPin]);
        openPopup();
      }
      return;
    }
    activeElement = activeElement.parentNode;
  }
};

pinMain.addEventListener('mouseup', startPage);
pinsContainer.addEventListener('click', clickPin);
mapElementClose.addEventListener('click', closePinMouse);
mapElementClose.addEventListener('keydown', onEnterClosePin);

// переменные для валидации
var houseTitle = noticeForm.querySelector('#title');
var houseType = noticeForm.querySelector('#type');
var housePrice = noticeForm.querySelector('#price');
var houseCheckIn = noticeForm.querySelector('#timein');
var houseCheckOut = noticeForm.querySelector('#timeout');
var roomNumber = noticeForm.querySelector('#room_number');
var houseAccordance = noticeForm.querySelector('#capacity');

var changeBorderColor = function (element) {
  element.style.borderWidth = '3px';
  element.style.borderColor = 'red';
};

var returnBorderColor = function (element) {
  element.style.borderWidth = '';
  element.style.borderColor = '';
};

// для заголовка
var onWrongTitle = function () {
  changeBorderColor(houseTitle);
  if (houseTitle.validity.tooShort) {
    houseTitle.setCustomValidity('Заголовок должен быть не менее 30-ти символов');
  } else if (houseTitle.validity.tooLong) {
    houseTitle.setCustomValidity('Заголовок не должен превышать длинну в 100 символов');
  } else if (houseTitle.validity.valueMissing) {
    houseTitle.setCustomValidity('Обязательное поле');
  } else {
    houseTitle.setCustomValidity('');
    returnBorderColor(houseTitle);
  }
};

var onBlurTitle = function (evt) {
  evt.target.checkValidity();
};

var onFocusTitle = function (evt) {
  returnBorderColor(evt.target);
};

var changeCheckIn = function () {
  houseCheckOut.selectedIndex = houseCheckIn.selectedIndex;
};

var changeCheckOut = function () {
  houseCheckIn.value = houseCheckOut.value;
};

var changeType = function () {
  housePrice.min = offerPrice[houseType.value];
};

var onWrongPrice = function () {
  changeBorderColor(housePrice);
  if (housePrice.validity.rangeUnderflow) {
    housePrice.setCustomValidity('Стоимость жилья ниже рекомендованной');
  } else if (housePrice.validity.rangeOverflow) {
    housePrice.setCustomValidity('Стоимость жилья слишком высока');
  } else {
    housePrice.setCustomValidity('');
    returnBorderColor(housePrice);
  }
};

var changePrice = function () {
  returnBorderColor(housePrice);
  housePrice.setCustomValidity('');
};

var onChangeRoomNumber = function () {
  var lenCapacitySelectDef = houseAccordance.options.length;
  var arrCapacitySelect = roomsAccordance[roomNumber.value];
  var lenCapacitySelect = arrCapacitySelect.length;
  [].forEach.call(houseAccordance.options, roomsActivate);
  for (var i = 0; i < lenCapacitySelectDef; i++) {
    var search = false;
    for (var j = 0; j < lenCapacitySelect; j++) {
      if (arrCapacitySelect[j] === parseInt(houseAccordance.options[i].value, 10)) {
        search = true;
        break;
      }
    }
    if (!search) {
      roomsDeactivate(houseAccordance.options[i]);
    }
  }
  houseAccordance.value = arrCapacitySelect[0];
};

var roomsActivate = function (elem) {
  elem.classList.remove('hidden');
};

var roomsDeactivate = function (elem) {
  elem.classList.add('hidden');
};

houseTitle.addEventListener('invalid', onWrongTitle);
houseTitle.addEventListener('blur', onBlurTitle);
houseTitle.addEventListener('focus', onFocusTitle);
houseCheckIn.addEventListener('change', changeCheckIn);
houseCheckOut.addEventListener('change', changeCheckOut);
houseType.addEventListener('change', changeType);
housePrice.addEventListener('invalid', onWrongPrice);
housePrice.addEventListener('change', changePrice);
roomNumber.addEventListener('change', onChangeRoomNumber);

allObjects = getPosts(PINS_NUMBER);
allObjects.forEach(showPins);
mainMap.appendChild(mapElement);
mapElement.classList.add('hidden');