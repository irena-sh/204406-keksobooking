﻿'use strict';
window.showCard = (function () {
  // Константы
  // Коды для клавиатуры
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  // Переменные
  // Часть шаблона - карточка объекта недвижимости
  var mapElementTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapElement = mapElementTemplate.cloneNode(true);
  var mapElementClose = mapElement.querySelector('.popup__close');
  // Текущий маркер
  var actualPin = false;

  // Функции для обработки событий
  // Сброс активного маркера
  var hidePin = function () {
    if (actualPin !== false) {
      actualPin.classList.remove('map__pin--active');
    }
  };
  // Реакция на нажатие ESC
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === keyCodes.ESC) {
      closePopup();
    }
  };
  // Закрыть карточку мышкой
  var closePinMouse = function () { // закрыть мышкой
    closePopup();
  };
  // Закрыть карточку с клавиатуры
  var onCardCloseEnterPress = function (evt) {
    if (evt.keyCode === keyCodes.ENTER) {
      closePopup();
    }
  };
  // Открыть карточку
  var openPopup = function () {
    mapCard.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };
  // Закрыть карточку
  var closePopup = function () {
    mapCard.classList.add('hidden');
    pinDeactivate();
    currentPin = false;
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Обработчики событий
  // Закрытие карточки по нажатию мышки
  mapCardClose.addEventListener('click', onCardCloseClick);
  // Закрытие карточки с клавиатуры
  mapCardClose.addEventListener('keydown', onCardCloseEnterPress);

  return {
    // Заполняем и открываем карточку
    renderAndOpen: function (elem, arrAds, pins) {
      var clickedElement = elem;
      while (clickedElement !== pins) {
        if (clickedElement.tagName === 'BUTTON') {
          pinDeactivate();
          clickedElement.classList.add('map__pin--active');
          currentPin = clickedElement;
          if (!clickedElement.classList.contains('map__pin--main')) {
            // Заполняем DOM-ноду карточки данными из массива объектов
            window.card.render(mapCard, arrAds[clickedElement.dataset.numPin]);
            openPopup();
          } else {
            mapCard.classList.add('hidden');
          }
        }
        clickedElement = clickedElement.parentNode;
      }
      return mapCard;
    }
  };
})();