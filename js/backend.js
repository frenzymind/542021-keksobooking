'use strict';

window.backend = (function () {

  var SERVER_GET_DATA_URL = 'https://1510.dump.academy/keksobooking/data';
  var SERVER_SAVE_DATA_URL = 'https://1510.dump.academy/keksobooking';

  function makeRequest(url, type, onLoad, onError, data) {

    data = data || null;

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.open(type, url);

    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {

      onError('Ошибка соединения!');

    });

    xhr.send(data);
  }

  return {

    load: function (onLoad, onError) {

      makeRequest(SERVER_GET_DATA_URL, 'GET', onLoad, onError);

    },
    save: function (data, onLoad, onError) {

      makeRequest(SERVER_SAVE_DATA_URL, 'POST', onLoad, onError, data);

    }
  };

})();
