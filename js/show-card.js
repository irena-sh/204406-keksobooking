'use strict';
window.showCard = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var mapElementTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapElement = mapElementTemplate.cloneNode(true);
  var mapElementClose = mapElement.querySelector('.popup__close');
  var actualPin = false;

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

  var closePinMouse = function () { // закрыть мышкой
    closePopup();
  };

  var onEnterClosePin = function (event) { // закрыть клавишей
    if (event.keyCode === ENTER_KEYCODE) {
      closePopup();
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

  mapElementClose.addEventListener('click', closePinMouse);
  mapElementClose.addEventListener('keydown', onEnterClosePin);

  return {
    openCard: function (elem, arrAds, pins) {
      var activeElement = elem;
      while (activeElement !== pins) {
        if (activeElement.tagName === 'BUTTON') {
          hidePin();
          activeElement.classList.add('map__pin--active');
          actualPin = activeElement;
          if (!activeElement.classList.contains('map__pin--main')) {
            window.card.render(mapElement, arrAds[activeElement.dataset.numPin]);
            openPopup();
          } else {
            mapElement.classList.add('hidden');
          }
        }
        activeElement = activeElement.parentNode;
      }
      return mapElement;
    }
  };
})();
