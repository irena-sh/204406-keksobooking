'use strict';

function getPosts() {
  var OBJECTS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
  ].sort(compareRandom);

  var PINS_NUMBER = [1, 2, 3, 4, 5, 6, 7, 8].sort(compareRandom);
  var TYPES = ['flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PRICE_RANGE = {min: 1000, max: 10000000};
  var ROOM_NUMBERS = {min: 1, max: 5};
  var GUESTS = {min: 1, max: 4};
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
  var posts = [];

  // объекты недвижимости
  for (var i = 0; i < PINS_NUMBER.length; i++) {
    var locationX = getRandomValue(coordinates.x.min, coordinates.x.max);
    var locationY = getRandomValue(coordinates.y.min, coordinates.y.max);
    posts.push({
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: OBJECTS[i],
        address: locationX + ', ' + locationY,
        price: getRandomValue(PRICE_RANGE.max, PRICE_RANGE.min, -1),
        type: getRandomItem(TYPES),
        rooms: getRandomValue(ROOM_NUMBERS.max, ROOM_NUMBERS.min),
        guests: getRandomValue(GUESTS.max, GUESTS.min),
        checkin: getRandomItem(TIMES),
        checkout: getRandomItem(TIMES),
        features: getRandomQuantity(OFFER_FEATURES),
        description: '',
        photos: []
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return posts;
}

function createMap(post) {
  var size = 40;
  var btn = document.createElement('button');
  var img = document.createElement('img');
  btn.style.left = (post.location.x - size / 2) + 'px';
  btn.style.top = (post.location.y - size) + 'px';
  btn.className = 'map__pin';
  img.src = post.author.avatar;
  img.width = size;
  img.height = size;
  img.draggable = false;
  btn.appendChild(img);
  return btn;
}

function renderMapPins(posts) {
  var element = document.createDocumentFragment();
  for (var i = 0; i < posts.length; i++) {
    element.appendChild(createMap(posts[i]));
  }
  document.querySelector('.map__pins').appendChild(element);
}

function showPopup(post) {
  var template = document.querySelector('template').content.querySelector('article.map__card');
  var mapElement = template.cloneNode(true);
  var offer = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };
  var postType = mapElement.querySelector('h4');
  var features = mapElement.querySelector('.popup__features');
  var featuresFragment = document.createDocumentFragment();
  mapElement.querySelector('.popup__avatar').src = post.author.avatar;
  mapElement.querySelector('h3').textContent = post.offer.title;
  mapElement.querySelector('small').textContent = post.offer.address;
  mapElement.querySelector('.popup__price').innerHTML = post.offer.price + '&#x20bd;/ночь';
  postType.textContent = offer[post.offer.type];
  postType.nextElementSibling.textContent = post.offer.rooms + ' Комнаты для ' + post.offer.guests + ' гостей';
  postType.nextElementSibling.nextElementSibling.textContent = 'Заезд после ' + post.offer.checkin + ' , выезд до ' + post.offer.checkout;
  mapElement.querySelector('.popup__features').innerHTML = '';
  for (var i = 0; i < post.offer.features.length; i++) {
    var li = document.createElement('li');
    li.className = 'feature  feature--' + post.offer.features[i];
    featuresFragment.appendChild(li);
  }
  features.appendChild(featuresFragment);
  features.nextElementSibling.textContent = post.offer.description;

  document.querySelector('.map').appendChild(mapElement);
}

function renderMap() {
  var post = getPosts();
  renderMapPins(post);
  showPopup(post[0]);
}
renderMap();

function compareRandom() {
  return Math.random() - 0.5;
}

function getRandomValue(max, min, accuracy) {
  accuracy = accuracy || 0;
  min = min || 0;
  var random = Math.random() * (max - min) + min;
  return Math.round(random * Math.pow(10, accuracy)) / Math.pow(10, accuracy);
}

function getRandomQuantity(arr) {
  var subsetLength = getRandomValue(arr.length - 1);
  var subset = [];
  var item = [];

  for (var i = 0; i < subsetLength; i++) {
    item = arr[getRandomValue(arr.length - 1)];
    if (subset.indexOf(item) + 1) {
      i--;
    } else {
      subset.push(item);
    }
  }
  return subset;
}

function getRandomItem(arr) {
  return arr[getRandomValue(arr.length - 1)];
}
