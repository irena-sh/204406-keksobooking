'use strict';

window.card = (function () {
  var showString = function (element) {
    return '<li class="feature feature--' + element + '"></li>';
  };

  return {
    render: function (newElement, post) {
      var newElementP = newElement.querySelectorAll('p');
      var newElementUl = newElement.querySelector('.popup__features');
      newElement.querySelector('img').src = post.author.avatar;
      newElement.querySelector('h3').textContent = post.offer.title;
      newElement.querySelector('.popup__price').innerHTML = post.offer.price + '&#x20bd;/ночь';
      newElement.querySelector('small').textContent = post.offer.address;
      newElement.querySelector('h4').textContent = window.data.places[post.offer.type];
      newElementP[2].textContent = post.offer.rooms + ' Комнаты для ' + post.offer.guests + ' гостей';
      newElementP[3].textContent = 'Заезд после ' + post.offer.checkin + ', выезд до ' + post.offer.checkout;
      newElementP[4].textContent = post.offer.description;
      newElementUl.innerHTML = '';
      newElementUl.insertAdjacentHTML('afterBegin', post.offer.features.map(showString).join(' '));
      newElement.appendChild(newElementUl);
      return newElement;
    }
  };
})();