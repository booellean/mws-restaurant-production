'use strict';

var restaurants = void 0,
    neighborhoods = void 0,
    cuisines = void 0;
var newMap;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
// document.addEventListener('DOMContentLoaded', (event) => {
//   initMap(); // added
//   DBHelper.fetchNeighborhoods();
//   DBHelper.fetchCuisines();
// });
/**
 * Fetch neighborhoods and cuisines as soon as database is created
 */
function initPage() {
  initMap(); // added
  DBHelper.fetchNeighborhoods();
  DBHelper.fetchCuisines();
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
function fetchNeighborhoods(error, neighborhoods) {
  if (error) {
    // Got an error
    console.error(error);
  } else {
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML();
  }
}

//Original function
// fetchNeighborhoods = () => {
//   DBHelper.fetchNeighborhoods((error, neighborhoods) => {
//     if (error) { // Got an error
//       console.error(error);
//     } else {
//       self.neighborhoods = neighborhoods;
//       fillNeighborhoodsHTML();
//     }
//   });
// }

/**
 * Set neighborhoods HTML.
 */
function fillNeighborhoodsHTML() {
  var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;

  var select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(function (neighborhood) {
    var option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
function fetchCuisines(error, cuisines) {
  if (error) {
    // Got an error!
    console.error(error);
  } else {
    self.cuisines = cuisines;
    fillCuisinesHTML();
  }
}

//Original function
// fetchCuisines = () => {
//   DBHelper.fetchCuisines((error, cuisines) => {
//     if (error) { // Got an error!
//       console.error(error);
//     } else {
//       self.cuisines = cuisines;
//       fillCuisinesHTML();
//     }
//   });
// }

/**
 * Set cuisines HTML.
 */
function fillCuisinesHTML() {
  var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;

  var select = document.getElementById('cuisines-select');

  cuisines.forEach(function (cuisine) {
    var option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
function initMap() {
  self.newMap = L.map('map', {
    center: [40.722216, -73.987501],
    zoom: 12,
    scrollWheelZoom: false
  });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1IjoiYm9vZWxsZWFuIiwiYSI6ImNqaXo3eHdodDA0YW4zcXBjMjd6dXowZnIifQ.d5RF4w_C9ppt_nAyldHBXQ',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */

function updateRestaurants() {
  var cSelect = document.getElementById('cuisines-select');
  var nSelect = document.getElementById('neighborhoods-select');

  var cIndex = cSelect.selectedIndex;
  var nIndex = nSelect.selectedIndex;

  var cuisine = cSelect[cIndex].value;
  var neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood);
}

function fillUpdatedRestaurants(error, restaurants) {
  if (error) {
    // Got an error!
    console.error(error);
  } else {
    resetRestaurants(restaurants);
    fillRestaurantsHTML();
  }
}

// updateRestaurants = () => {
//   const cSelect = document.getElementById('cuisines-select');
//   const nSelect = document.getElementById('neighborhoods-select');

//   const cIndex = cSelect.selectedIndex;
//   const nIndex = nSelect.selectedIndex;

//   const cuisine = cSelect[cIndex].value;
//   const neighborhood = nSelect[nIndex].value;

//   DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood);
// }

// fillUpdatedRestaurants = (error, restaurants) => {
//   if (error) { // Got an error!
//     console.error(error);
//   } else {
//     resetRestaurants(restaurants);
//     fillRestaurantsHTML();
//   }
// }

//Original Function
// updateRestaurants = () => {
//   const cSelect = document.getElementById('cuisines-select');
//   const nSelect = document.getElementById('neighborhoods-select');

//   const cIndex = cSelect.selectedIndex;
//   const nIndex = nSelect.selectedIndex;

//   const cuisine = cSelect[cIndex].value;
//   const neighborhood = nSelect[nIndex].value;

//   DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
//     if (error) { // Got an error!
//       console.error(error);
//     } else {
//       resetRestaurants(restaurants);
//       fillRestaurantsHTML();
//     }
//   })
// }

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
function resetRestaurants(restaurants) {
  // Remove all restaurants
  self.restaurants = [];
  var ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(function (marker) {
      return marker.remove();
    });
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
function fillRestaurantsHTML() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  var ul = document.getElementById('restaurants-list');
  restaurants.forEach(function (restaurant) {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
function createRestaurantHTML(restaurant) {
  var li = document.createElement('li');
  var newId = restaurant.name.replace(/[^A-Za-z0-9]/g, '');
  li.setAttribute('id', newId); //used to create nodes for focus_helper
  li.setAttribute('tabindex', '-1');
  observer.observe(li); //used for lazy loading all classes 'lazy-load'

  var divDescript = document.createElement('div'); //To allow proper tabbing, otherwise list gets stuck
  divDescript.setAttribute('aria-label', restaurant.name + ' restaurant. Please Use Arrow Keys to View Items.');
  divDescript.className = 'list-item-describor focus-item';
  li.append(divDescript);

  var image = document.createElement('img');
  image.className = 'focus-item restaurant-img lazy-load';
  image.setAttribute('id', restaurant.id);
  image.setAttribute('alt', restaurant.alt);
  li.append(image);

  var name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  name.className = 'focus-item lazy-load';
  li.append(name);

  var neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.className = 'focus-item lazy-load';
  li.append(neighborhood);

  var address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.className = 'focus-item  lazy-load';
  li.append(address);

  var more = document.createElement('a');
  more.setAttribute('aria-label', 'View details and reviews of restaurant ' + restaurant.name);
  more.innerHTML = 'View Details';
  more.className = 'focus-item lazy-load';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
}

/**
 * Add markers for current restaurants to the map.
 * Inits focus groups for functionality
 */
function addMarkersToMap() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  var mapBox = document.getElementById('map');
  var skiplink = document.createElement('a');
  skiplink.className = 'skip-link';
  skiplink.href = '#restaurants-list';
  skiplink.setAttribute('aria-label', 'Skip link: skip Mapbox map and jump to restaurant content.');
  skiplink.setAttribute('tabindex', '0');

  mapBox.prepend(skiplink);

  restaurants.forEach(function (restaurant) {
    // Add marker to the map
    var marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

  indexObjects();
}