'use strict';
window.synchronizeFields = function (firstEl, secondEl, firstValue, secondValue, sync) {
  var numElem = firstValue.indexOf(firstEl.value);
  var secondElValue = secondValue[numElem];
  sync(secondEl, secondElValue);
};
