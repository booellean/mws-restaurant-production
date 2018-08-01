'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Common database helper functions.
 */
/**
* @description Create an indexedDB object and upgrade if necessary
* @returns {object} keypath of "id"
*/

var restaurantBackup = void 0; //backup if indexedDB is not supported
var idbName = 'restaurant-data';
var idbTx = 'restaurant';

var dbPromise = idb.open(idbName, 1, function (upgradeDB) {
  upgradeDB.createObjectStore('restaurant', { keyPath: 'id' });
});

window.addEventListener('load', initiateDatabase);

function initiateDatabase() {
  DBHelper.fetchRestaurants();
}

var DBHelper = function () {
  function DBHelper() {
    _classCallCheck(this, DBHelper);
  }

  _createClass(DBHelper, null, [{
    key: 'fetchRestaurants',


    /**
     * Fetch all restaurants.
     */
    // static fetchRestaurants(method, cuisine, neighborhood, id) {
    value: function fetchRestaurants() {
      fetch(DBHelper.DATABASE_URL).then(function (response) {
        var restaurants = response.json();
        return restaurants;
      }).then(function (restaurants) {
        if (!window.indexedDB) {
          restaurantBackup = restaurants;
          return;
        }
        dbPromise.then(function (db) {
          var tx = db.transaction(idbTx, 'readwrite');
          var keyValStore = tx.objectStore(idbTx);
          restaurants.forEach(function (restaurant) {
            keyValStore.put({
              id: restaurant.id,
              name: restaurant.name,
              neighborhood: restaurant.neighborhood,
              photograph: restaurant.photograph,
              ext: restaurant.ext,
              alt: restaurant.alt,
              address: restaurant.address,
              latlng: restaurant.latlng,
              cuisine_type: restaurant.cuisine_type,
              operating_hours: restaurant.operating_hours,
              reviews: restaurant.reviews
            });
          });
        });
      }).then(function () {
        return initPage();
      })
      // .then( restaurants => {
      //   method(null, restaurants, cuisine, neighborhood, id);
      // })
      .catch(function (error) {
        console.log(error);
        restaurantBackup = (error, null);
      });

      //Original code
      // )
      // let xhr = new XMLHttpRequest();
      // xhr.open('GET', DBHelper.DATABASE_URL);
      // xhr.onload = () => {
      //   if (xhr.status === 200) { // Got a success response from server!
      //     const json = JSON.parse(xhr.responseText);
      //     const restaurants = json.restaurants;
      //     callback(null, restaurants);
      //   } else { // Oops!. Got an error from server.
      //     const error = (`Request failed. Returned status of ${xhr.status}`);
      //     callback(error, null);
      //   }
      // };
      // xhr.send();
    }

    /**
     * Fetch a restaurant by its ID.
     */

  }, {
    key: 'fetchRestaurantById',
    value: function fetchRestaurantById(id, error) {
      // fetch all restaurants with proper error handling.
      if (error) {
        fillFetchedRestaurantFromURL(error, null);
      } else {
        dbPromise.then(function (db) {
          var tx = db.transaction(idbTx);
          var keyValStore = tx.objectStore(idbTx);
          var restaurants = keyValStore.getAll();

          return restaurants;
        }).then(function (restaurants) {
          var restaurant = restaurants.find(function (r) {
            return r.id == id;
          });
          if (restaurant) {
            // Got the restaurant
            fillFetchedRestaurantFromURL(null, restaurant);
          } else {
            // Restaurant does not exist in the database
            fillFetchedRestaurantFromURL('Restaurant does not exist', null);
          }
        });
      }

      //Original Function
      // DBHelper.fetchRestaurants( (error, restaurants) => {
      // if (error) {
      //   callback(error, null);
      // } else {
      //   const restaurant = restaurants.find(r => r.id == id);
      //   if (restaurant) { // Got the restaurant
      //     callback(null, restaurant);
      //   } else { // Restaurant does not exist in the database
      //     callback('Restaurant does not exist', null);
      //   }
      // }
      // });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    // static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    // DBHelper.fetchRestaurants((error, restaurants) => {
    //   if (error) {
    //     return fetch(error, null);
    //   } else {
    //     // Filter restaurants to have only given cuisine type
    //     const results = restaurants.filter(r => r.cuisine_type == cuisine);
    //     return fetch(null, results);
    //   }
    //   // if (error) {
    //   //   callback(error, null);
    //   // } else {
    //   //   // Filter restaurants to have only given cuisine type
    //   //   const results = restaurants.filter(r => r.cuisine_type == cuisine);
    //   //   callback(null, results);
    //   // }
    // });
    // }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    // static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    // DBHelper.fetchRestaurants((error, restaurants) => {
    //   if (error) {
    //     return fetch(error, null);
    //   } else {
    //     // Filter restaurants to have only given neighborhood
    //     const results = restaurants.filter(r => r.neighborhood == neighborhood);
    //     return fetch(null, results);
    //   }
    //   // if (error) {
    //   //   callback(error, null);
    //   // } else {
    //   //   // Filter restaurants to have only given neighborhood
    //   //   const results = restaurants.filter(r => r.neighborhood == neighborhood);
    //   //   callback(null, results);
    //   // }
    // });
    // }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */

  }, {
    key: 'fetchRestaurantByCuisineAndNeighborhood',
    value: function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, error) {
      // Fetch all restaurants
      if (restaurantBackup === (error, null)) {
        fillUpdatedRestaurants(error, null);
      } else {
        dbPromise.then(function (db) {
          var tx = db.transaction(idbTx);
          var keyValStore = tx.objectStore(idbTx);
          var restaurants = keyValStore.getAll();

          return restaurants;
        }).then(function (restaurants) {
          var results = restaurants;
          if (cuisine != 'all') {
            // filter by cuisine
            results = results.filter(function (r) {
              return r.cuisine_type == cuisine;
            });
          }
          if (neighborhood != 'all') {
            // filter by neighborhood
            results = results.filter(function (r) {
              return r.neighborhood == neighborhood;
            });
          }
          fillUpdatedRestaurants(null, results);
        });
      }

      //Original function
      // DBHelper.fetchRestaurants((error, restaurants) => {
      //   if (error) {
      //     return fetch(error, null);
      //   } else {
      //     let results = restaurants
      //     if (cuisine != 'all') { // filter by cuisine
      //       results = results.filter(r => r.cuisine_type == cuisine);
      //     }
      //     if (neighborhood != 'all') { // filter by neighborhood
      //       results = results.filter(r => r.neighborhood == neighborhood);
      //     }
      //     return fetch(null, results);
      //   }
      // });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */

  }, {
    key: 'fetchNeighborhoods',
    value: function (_fetchNeighborhoods) {
      function fetchNeighborhoods(_x) {
        return _fetchNeighborhoods.apply(this, arguments);
      }

      fetchNeighborhoods.toString = function () {
        return _fetchNeighborhoods.toString();
      };

      return fetchNeighborhoods;
    }(function (error) {
      // Fetch all restaurants
      if (restaurantBackup === (error, null)) {
        fetchNeighborhoods(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        dbPromise.then(function (db) {
          var tx = db.transaction(idbTx);
          var keyValStore = tx.objectStore(idbTx);
          var restaurants = keyValStore.getAll();

          return restaurants;
        }).then(function (restaurants) {
          var neighborhoods = restaurants.map(function (v, i) {
            return restaurants[i].neighborhood;
          });
          // Remove duplicates from neighborhoods
          var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {
            return neighborhoods.indexOf(v) == i;
          });
          fetchNeighborhoods(null, uniqueNeighborhoods);
        });
      }

      //Original code
      // if (error) {
      //   callback(error, null);
      // } else {
      //   // Get all neighborhoods from all restaurants
      //   const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
      //   // Remove duplicates from neighborhoods
      //   const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
      //   callback(null, uniqueNeighborhoods);
      // }
      // });
    })

    /**
     * Fetch all cuisines with proper error handling.
     */

  }, {
    key: 'fetchCuisines',
    value: function (_fetchCuisines) {
      function fetchCuisines(_x2) {
        return _fetchCuisines.apply(this, arguments);
      }

      fetchCuisines.toString = function () {
        return _fetchCuisines.toString();
      };

      return fetchCuisines;
    }(function (error) {
      // Fetch all restaurants
      if (error) {
        fetchCuisines(error, null);
      } else {
        dbPromise.then(function (db) {
          var tx = db.transaction(idbTx);
          var keyValStore = tx.objectStore(idbTx);
          var restaurants = keyValStore.getAll();

          return restaurants;
        }).then(function (restaurants) {
          // Get all cuisines from all restaurants
          var cuisines = restaurants.map(function (v, i) {
            return restaurants[i].cuisine_type;
          });
          // Remove duplicates from cuisines
          var uniqueCuisines = cuisines.filter(function (v, i) {
            return cuisines.indexOf(v) == i;
          });
          fetchCuisines(null, uniqueCuisines);
        });
      }

      //Original code
      // Fetch all restaurants
      // DBHelper.fetchRestaurants((error, restaurants) => {
      //   if (error) {
      //     return fetch(error, null);
      //   } else {
      //     // Get all cuisines from all restaurants
      //     const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
      //     // Remove duplicates from cuisines
      //     const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
      //     return fetch(null, uniqueCuisines);
      //   }
      // });
    })

    /**
     * Restaurant page URL.
     */

  }, {
    key: 'urlForRestaurant',
    value: function urlForRestaurant(restaurant) {
      return './restaurant.html?id=' + restaurant.id;
    }

    /**
     * Restaurant image URL.
     */

  }, {
    key: 'imageUrlForRestaurant',
    value: function imageUrlForRestaurant(restaurant) {
      return '/img/' + restaurant.photograph + restaurant.ext;
    }
  }, {
    key: 'imageSrcsetForRestaurant',
    value: function imageSrcsetForRestaurant(restaurant) {
      return '/img/' + restaurant.photograph + '-200' + restaurant.ext + ' 400w,\n\t\t\t /img/' + restaurant.photograph + '-400' + restaurant.ext + ' 600w,\n\t\t\t /img/' + restaurant.photograph + '-600' + restaurant.ext + ' 800w,\n\t\t\t /img/' + restaurant.photograph + restaurant.ext + ' 1000w';
    }
  }, {
    key: 'imageSizesForRestaurant',
    value: function imageSizesForRestaurant(restaurant) {
      return '(max-width: 320px) 400w,\n\t          (max-width: 400px) 600w,\n\t\t\t      (max-width: 600px) 800w,\n\t\t\t      1000w';
    }

    /**
     * Map marker for a restaurant.
     */

  }, {
    key: 'mapMarkerForRestaurant',
    value: function mapMarkerForRestaurant(restaurant, map) {
      // https://leafletjs.com/reference-1.3.0.html#marker
      var marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], { title: restaurant.name,
        alt: restaurant.name + 'location marker',
        url: DBHelper.urlForRestaurant(restaurant)
      });
      marker.addTo(newMap);
      return marker;
    }
  }, {
    key: 'DATABASE_URL',


    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    get: function get() {
      var port = 1337; // Change this to your server port
      return 'http://localhost:' + port + '/restaurants/';
      // const port = 1337
      // return `https://booellean.github.io/${port}/restaurants/`;
    }
  }]);

  return DBHelper;
}();