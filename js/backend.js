'use strict';
window.backend = (function () {
  var SAVE_URL = 'https://1510.dump.academy/keksobooking';
  var TIMEOUT = 10000;

  var loadRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = TIMEOUT;
    return xhr;
  };

  return {
    load: function (onLoad, onError) {
      var xhr = loadRequest(onLoad, onError);
      xhr.open('GET', SAVE_URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = loadRequest(onLoad, onError);
      xhr.open('POST', SAVE_URL);
      xhr.send(data);
    },

    onErrorLoadSave: function (errorMessage) {
      var errorInformation = document.createElement('div');
      errorInformation.style = 'position: fixed; z-index: 100; padding: 15px auto; text-align: center; background-color: #F22544; border: 1px solid black; border-radius: 4px; font-size: 20px';
      errorInformation.style.left = 0;
      errorInformation.style.right = 0;
      errorInformation.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorInformation);
    }
  };
})();
