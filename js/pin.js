'use strict';

window.pin = (function () {
  var PIN_Y = 62;

  var mapTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var pinX = function (x) {
    return x + 'px';
  };

  var pinY = function (y) {
    return (y - PIN_Y) + 'px';
  };

  return {
    render: function (post, i) {
      var pin = mapTemplate.cloneNode(true);
      pin.querySelector('img').src = post.author.avatar;
      pin.style.left = pinX(post.location.x);
      pin.style.top = pinY(post.location.y);
      pin.dataset.numPin = i;
      this.appendChild(pin);
      return this;
    }
  };
})();
