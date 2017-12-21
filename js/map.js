'use strict';

(function () {
  var LIMIT = {
    min: 100,
    max: 450
  };

  var PIN_WIDTH = 20;
  var PIN_HEIGHT = 50;

  var mainMap = document.querySelector('.map');
  var pinsContainer = mainMap.querySelector('.map__pins');
  var pinMain = mainMap.querySelector('.map__pin--main');
  var fragment = document.createDocumentFragment();
  var allObjects = []; // объекты недвижимости
  var mainPin = document.querySelector('.map__pin--main');
  var houseFilter = document.querySelector('.map__filters');
  var newObjects = [];

  var startPage = function () { // начало работы с картой
    mainMap.classList.remove('map--faded');
    pinsContainer.appendChild(fragment);
    window.form.activate();
  };

  var clickPin = function (evt) {
    window.showCard.openCard(evt.target, allObjects, pinsContainer);
  };

  var onStartPageMousedown = function (event) {
    event.preventDefault();
    var coords = {
      x: event.clientX,
      y: event.clientY
    };

    var onMouseMove = function (eventM) {
      eventM.preventDefault();
      var movement = {
        x: coords.x - eventM.clientX,
        y: coords.y - eventM.clientY
      };
      coords = {
        x: eventM.clientX,
        y: eventM.clientY
      };
      var newY = mainPin.offsetTop - movement.y;
      var newX = mainPin.offsetLeft - movement.x;
      if (newY > LIMIT.min && newY < LIMIT.max) {
        mainPin.style.top = newY + 'px';
      }
      mainPin.style.left = newX + 'px';
      var houseAddress = document.querySelector('#address');
      houseAddress.value = 'x: ' + (newX + PIN_WIDTH) + ', y: ' + (newY + PIN_HEIGHT);
    };

    var onMouseUp = function (eventUp) {
      eventUp.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onSuccessSave = function (arrData) {
    newObjects = arrData.slice();
    allObjects = window.mapFilters.sample(arrData);
    allObjects.forEach(window.pin.render, fragment);
    pinMain.addEventListener('mouseup', startPage);
  };

  var resetPins = function () {
    while (pinsContainer.childElementCount > 2) {
      pinsContainer.removeChild(pinsContainer.lastChild);
    }
  };

  var onChangeFilter = function () {
    allObjects = window.mapFilters.updateData(newObjects);
    allObjects.forEach(window.pin.render, fragment);
    resetPins();
    pinsContainer.appendChild(fragment);
  };

  pinMain.addEventListener('mousedown', onStartPageMousedown);
  pinMain.addEventListener('mouseup', startPage);
  pinsContainer.addEventListener('click', clickPin);

  mainMap.appendChild(window.showCard.openCard(pinMain, allObjects[0], pinsContainer));
  window.backend.load(onSuccessSave, window.backend.onErrorHandler);
  pinsContainer.addEventListener('click', clickPin);
  houseFilter.addEventListener('change', function () {
    window.debounce(onChangeFilter);
  });
})();
