﻿'use strict';

window.form = (function () {
  var noticeForm = document.querySelector('.notice__form');

  var houseType = noticeForm.querySelector('#type');
  var houseTitle = noticeForm.querySelector('#title');
  var housePrice = noticeForm.querySelector('#price');
  var houseCheckIn = noticeForm.querySelector('#timein');
  var houseCheckOut = noticeForm.querySelector('#timeout');
  var roomNumber = noticeForm.querySelector('#room_number');
  var houseAccordance = noticeForm.querySelector('#capacity');

  var roomsAccordance = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };


  var changeBorderColor = function (element) {
    element.style.borderWidth = '3px';
    element.style.borderColor = 'red';
  };

  var returnBorderColor = function (element) {
    element.style.borderWidth = '';
    element.style.borderColor = '';
  };

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

  var onchangeCheckIn = function () {
    window.synchronizeFields(houseCheckIn, houseCheckOut, window.data.arrOfferChecks, window.data.arrOfferChecks, syncValues);
  };

  var onchangeCheckOut = function () {
    window.synchronizeFields(houseCheckOut, houseCheckIn, window.data.arrOfferChecks, window.data.arrOfferChecks, syncValues);
  };

  var onchangeType = function () {
    window.synchronizeFields(houseType, housePrice, window.data.placeType, window.data.prices, syncMin);
  };

  var syncValues = function (element, value) {
    element.value = value;
  };
  var syncMin = function (element, value) {
    element.min = value;
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

  var onchangePrice = function () {
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

  var roomsActivate = function (element) {
    element.classList.remove('hidden');
  };

  var roomsDeactivate = function (element) {
    element.classList.add('hidden');
  };

  houseTitle.addEventListener('invalid', onWrongTitle);
  houseTitle.addEventListener('blur', onBlurTitle);
  houseTitle.addEventListener('focus', onFocusTitle);
  houseCheckIn.addEventListener('change', onchangeCheckIn);
  houseCheckOut.addEventListener('change', onchangeCheckOut);
  houseType.addEventListener('change', onchangeType);
  housePrice.addEventListener('invalid', onWrongPrice);
  housePrice.addEventListener('change', onchangePrice);
  roomNumber.addEventListener('change', onChangeRoomNumber);

  return {
    activate: function () {
      noticeForm.classList.remove('notice__form--disabled');
    }
  };
})();
