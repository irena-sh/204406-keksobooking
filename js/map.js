'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var limit = {
    min: 100,
    max: 500
  };

  var pinHeight = 70;

  var mainMap = document.querySelector('.map');
  var pinsContainer = mainMap.querySelector('.map__pins');
  var mapElementTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapElement = mapElementTemplate.cloneNode(true);
  var pinMain = mainMap.querySelector('.map__pin--main');
  var mapElementClose = mapElement.querySelector('.popup__close');
  var fragment = document.createDocumentFragment();
  var actualPin = false;
  var allObjects = []; // объекты недвижимости

  var getCoords = function (element) {
    var box = element.getBoundingClientRect();
    return (box.left + pageXOffset) + 'px, ' + (box.top + pageYOffset) + 'px';
  };

  var startPage = function () { // начало работы с картой
    mainMap.classList.remove('map--faded');
    pinsContainer.appendChild(fragment);
    window.form.activate();
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
          window.card.render(mapElement, allObjects[activeElement.dataset.numPin]);
          openPopup();
        }
        return;
      }
      activeElement = activeElement.parentNode;
    }
  };

  var onStartPageMousedown = function (event) {
    event.preventDefault();
    var coords = {
      x: event.clientX,
      y: event.clientY
    };
    
    var onMouseMove = function (event) {
      event.preventDefault();
      var movement = {
        x: coords.x - event.clientX,
        y: coords.y - event.clientY
      };
      coords = {
        x: event.clientX,
        y: event.clientY
      };
      pinMain.style.left = (pinMain.offsetLeft - movement.x) + 'px';
      if ((pinMain.offsetTop - movement.y) >= (limit.min - pinHeight) && (pinMain.offsetTop - movement.y) <= (limit.max - pinHeight)) {
        pinMain.style.top = (pinMain.offsetTop - movement.y) + 'px';
      }
    };

    var onMouseUp = function (event) {
      event.preventDefault();
      var houseAdress = document.querySelector('#address');
      if (houseAdress) {
        houseAdress.value = 'x: {{' + coords.x + '}}, y: {{' + coords.y + '}}';
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  pinMain.addEventListener('mousedown', onStartPageMousedown);
  pinMain.addEventListener('mouseup', startPage);
  pinsContainer.addEventListener('click', clickPin);
  mapElementClose.addEventListener('click', closePinMouse);
  mapElementClose.addEventListener('keydown', onEnterClosePin);


  allObjects = window.data.getPosts();
  allObjects.forEach(window.pin.render, fragment);
  mainMap.appendChild(mapElement);
  mapElement.classList.add('hidden');
})();
