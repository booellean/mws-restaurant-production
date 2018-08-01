'use strict';

var restaurant = void 0;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
// document.addEventListener('DOMContentLoaded', (event) => {
//   initMap();
// });
/**
 * Fetch neighborhoods and cuisines as soon as database is created
 */
function initPage() {
  fetchRestaurantFromURL();
}

/**
 * Initialize leaflet map
 */
function initMap(error, restaurant) {
  if (error) {
    // Got an error!
    console.error(error);
  } else {
    self.newMap = L.map('map', {
      center: [restaurant.latlng.lat, restaurant.latlng.lng],
      zoom: 16,
      scrollWheelZoom: false
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
      mapboxToken: 'pk.eyJ1IjoiYm9vZWxsZWFuIiwiYSI6ImNqaXo3eHdodDA0YW4zcXBjMjd6dXowZnIifQ.d5RF4w_C9ppt_nAyldHBXQ',
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(newMap);
    fillBreadcrumb();
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    restaurantObjects(); //creates focus objects for document

    var mapBox = document.getElementById('map');
    var skiplink = document.createElement('a');
    skiplink.className = 'skip-link';
    skiplink.href = '#restaurant-container';
    skiplink.setAttribute('aria-label', 'Skip link: skip Mapbox map and jump to restaurant content.');
    skiplink.setAttribute('tabindex', '0');

    mapBox.prepend(skiplink);
  }
}

/**
 * Get current restaurant from page URL.
 */
function fetchRestaurantFromURL(callback) {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  var id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id);
  }
};

function fillFetchedRestaurantFromURL(error, restaurant) {
  self.restaurant = restaurant;
  if (!restaurant) {
    console.error(error);
    return;
  }
  fillRestaurantHTML();
  initMap(null, restaurant);
}

//Original Function
// fetchRestaurantFromURL = (callback) => {
//   if (self.restaurant) { // restaurant already fetched!
//     callback(null, self.restaurant)
//     return;
//   }
//   const id = getParameterByName('id');
//   if (!id) { // no id found in URL
//     error = 'No restaurant id in URL'
//     callback(error, null);
//   } else {
//     DBHelper.fetchRestaurants(id, (error, restaurant) => {
//       self.restaurant = restaurant;
//       if (!restaurant) {
//         console.error(error);
//         return;
//       }
//       fillRestaurantHTML();
//       callback(null, restaurant)
//     });
//   }
// }

/**
 * Create restaurant HTML and add it to the webpage
 */
function fillRestaurantHTML() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var restaurantContainer = document.getElementById('restaurant-container');
  var divDescript = document.createElement('div'); //To allow proper tabbing, otherwise list gets stuck
  divDescript.setAttribute('aria-label', restaurant.name + ' details section. Please Use Arrow Keys to View Items.');
  divDescript.className = 'list-item-describor focus-item';
  restaurantContainer.prepend(divDescript);
  observer.observe(restaurantContainer); //used for lazy loading all classes 'lazy-load'

  var name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.className = 'focus-item lazy-load';

  var address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.className = 'focus-item lazy-load';

  var image = document.getElementById('restaurant-img');
  image.className = 'focus-item restaurant-img lazy-load';
  image.setAttribute('alt', restaurant.alt);
  image.setAttribute('id', restaurant.id); //reset the id for the lazyLoad function in lazyload.js

  var cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.className = 'focus-item lazy-load';

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
function fillRestaurantHoursHTML() {
  var operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;

  var hours = document.getElementById('restaurant-hours');
  observer.observe(hours); //used for lazy loading all classes 'lazy-load'
  for (var key in operatingHours) {
    var row = document.createElement('tr');
    row.className = 'lazy-load';

    var day = document.createElement('td');
    day.innerHTML = key;
    day.className = 'focus-item';
    row.appendChild(day);

    var time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.className = 'focus-item';
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
function fillReviewsHTML() {
  var reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;

  var container = document.getElementById('reviews-container');
  var divDescript = document.createElement('div'); //To allow proper tabbing, otherwise list gets stuck
  divDescript.setAttribute('aria-label', 'Review Information. Please tab over and use arrow keys to cycle through content');
  divDescript.className = 'list-item-describor focus-item';
  container.prepend(divDescript);
  observer.observe(container); //used for lazy loading all classes 'lazy-load'

  var title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.className = 'focus-item lazy-load';
  container.appendChild(title);

  if (!reviews) {
    var noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    noReviews.className = 'focus-item lazy-load';
    container.appendChild(noReviews);
    return;
  }
  var ul = document.getElementById('reviews-list');
  reviews.forEach(function (review) {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
function createReviewHTML(review) {
  var li = document.createElement('li');
  var name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'focus-item lazy-load';
  li.appendChild(name);
  observer.observe(li); //used for lazy loading all classes 'lazy-load'

  var date = document.createElement('p');
  date.innerHTML = review.date;
  date.className = 'focus-item lazy-load';
  li.appendChild(date);

  var rating = document.createElement('p');
  rating.innerHTML = 'Rating: ' + review.rating;
  rating.className = 'focus-item lazy-load';
  li.appendChild(rating);

  var comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.className = 'focus-item lazy-load';
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
function fillBreadcrumb() {
  var restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;

  var breadcrumb = document.getElementById('breadcrumb');
  var breadcrumbUL = breadcrumb.querySelector('ul');
  var li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('tabindex', '0');
  li.setAttribute('aria-current', 'page');
  breadcrumbUL.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}