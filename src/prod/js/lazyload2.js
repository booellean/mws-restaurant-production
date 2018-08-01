'use strict';

var options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

var observer = new IntersectionObserver(lazyLoad, options);

function lazyLoad(elements) {
  elements.forEach(function (el) {
    if (el.intersectionRatio > 0.1) {
      loadItem(el.target);
      observer.unobserve(el.target);
    }
  });
}

function loadItem(el) {
  var childs = el.children;
  var childrenEls = Array.from(childs);

  childrenEls.forEach(function (child) {
    var restaurantId = child.id;
    if (!(child instanceof HTMLImageElement)) {
      return child.classList.remove('lazy-load');
    }
    if (child instanceof HTMLImageElement) {
      dbPromise.then(function (db) {
        return db.transaction('restaurant').objectStore('restaurant').getAll(); //cannot get individual items using variables, need to get all
      }).then(function (restaurants) {
        //must use '==' instead of '===' or will get blank array
        var restObject = restaurants.filter(function (item) {
          return item.id == restaurantId;
        });
        var restaurant = restObject[0];

        child.setAttribute('srcset', DBHelper.imageSrcsetForRestaurant(restaurant));
        child.setAttribute('sizes', DBHelper.imageSizesForRestaurant(restaurant));
        child.src = DBHelper.imageUrlForRestaurant(restaurant);
        child.classList.remove('lazy-load');
      });
      return;
    }
  });
}