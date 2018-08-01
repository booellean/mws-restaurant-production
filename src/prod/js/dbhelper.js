"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var restaurantBackup=void 0,idbName="restaurant-data",idbTx="restaurant",dbPromise=idb.open(idbName,1,function(upgradeDB){upgradeDB.createObjectStore("restaurant",{keyPath:"id"})});function initiateDatabase(){DBHelper.fetchRestaurants()}window.addEventListener("load",initiateDatabase);var DBHelper=function(){function DBHelper(){_classCallCheck(this,DBHelper)}return _createClass(DBHelper,null,[{key:"fetchRestaurants",value:function fetchRestaurants(){fetch(DBHelper.DATABASE_URL).then(function(response){var restaurants;return response.json()}).then(function(restaurants){window.indexedDB?dbPromise.then(function(db){var tx,keyValStore=db.transaction(idbTx,"readwrite").objectStore(idbTx);restaurants.forEach(function(restaurant){keyValStore.put({id:restaurant.id,name:restaurant.name,neighborhood:restaurant.neighborhood,photograph:restaurant.photograph,ext:restaurant.ext,alt:restaurant.alt,address:restaurant.address,latlng:restaurant.latlng,cuisine_type:restaurant.cuisine_type,operating_hours:restaurant.operating_hours,reviews:restaurant.reviews})})}):restaurantBackup=restaurants}).then(function(){return initPage()}).catch(function(error){console.log(error),restaurantBackup=null})}},{key:"fetchRestaurantById",value:function fetchRestaurantById(id,error){error?fillFetchedRestaurantFromURL(error,null):dbPromise.then(function(db){var tx,keyValStore,restaurants;return db.transaction(idbTx).objectStore(idbTx).getAll()}).then(function(restaurants){var restaurant=restaurants.find(function(r){return r.id==id});restaurant?fillFetchedRestaurantFromURL(null,restaurant):fillFetchedRestaurantFromURL("Restaurant does not exist",null)})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function fetchRestaurantByCuisineAndNeighborhood(cuisine,neighborhood,error){null===restaurantBackup?fillUpdatedRestaurants(error,null):dbPromise.then(function(db){var tx,keyValStore,restaurants;return db.transaction(idbTx).objectStore(idbTx).getAll()}).then(function(restaurants){var results=restaurants;"all"!=cuisine&&(results=results.filter(function(r){return r.cuisine_type==cuisine})),"all"!=neighborhood&&(results=results.filter(function(r){return r.neighborhood==neighborhood})),fillUpdatedRestaurants(null,results)})}},{key:"fetchNeighborhoods",value:function(_fetchNeighborhoods){function fetchNeighborhoods(_x){return _fetchNeighborhoods.apply(this,arguments)}return fetchNeighborhoods.toString=function(){return _fetchNeighborhoods.toString()},fetchNeighborhoods}(function(error){null===restaurantBackup?fetchNeighborhoods(error,null):dbPromise.then(function(db){var tx,keyValStore,restaurants;return db.transaction(idbTx).objectStore(idbTx).getAll()}).then(function(restaurants){var neighborhoods=restaurants.map(function(v,i){return restaurants[i].neighborhood}),uniqueNeighborhoods=neighborhoods.filter(function(v,i){return neighborhoods.indexOf(v)==i});fetchNeighborhoods(null,uniqueNeighborhoods)})})},{key:"fetchCuisines",value:function(_fetchCuisines){function fetchCuisines(_x2){return _fetchCuisines.apply(this,arguments)}return fetchCuisines.toString=function(){return _fetchCuisines.toString()},fetchCuisines}(function(error){error?fetchCuisines(error,null):dbPromise.then(function(db){var tx,keyValStore,restaurants;return db.transaction(idbTx).objectStore(idbTx).getAll()}).then(function(restaurants){var cuisines=restaurants.map(function(v,i){return restaurants[i].cuisine_type}),uniqueCuisines=cuisines.filter(function(v,i){return cuisines.indexOf(v)==i});fetchCuisines(null,uniqueCuisines)})})},{key:"urlForRestaurant",value:function urlForRestaurant(restaurant){return"./restaurant.html?id="+restaurant.id}},{key:"imageUrlForRestaurant",value:function imageUrlForRestaurant(restaurant){return"/img/"+restaurant.photograph+restaurant.ext}},{key:"imageSrcsetForRestaurant",value:function imageSrcsetForRestaurant(restaurant){return"/img/"+restaurant.photograph+"-200"+restaurant.ext+" 400w,\n\t\t\t /img/"+restaurant.photograph+"-400"+restaurant.ext+" 600w,\n\t\t\t /img/"+restaurant.photograph+"-600"+restaurant.ext+" 800w,\n\t\t\t /img/"+restaurant.photograph+restaurant.ext+" 1000w"}},{key:"imageSizesForRestaurant",value:function imageSizesForRestaurant(restaurant){return"(max-width: 320px) 400w,\n\t          (max-width: 400px) 600w,\n\t\t\t      (max-width: 600px) 800w,\n\t\t\t      1000w"}},{key:"mapMarkerForRestaurant",value:function mapMarkerForRestaurant(restaurant,map){var marker=new L.marker([restaurant.latlng.lat,restaurant.latlng.lng],{title:restaurant.name,alt:restaurant.name+"location marker",url:DBHelper.urlForRestaurant(restaurant)});return marker.addTo(newMap),marker}},{key:"DATABASE_URL",get:function get(){var port=1337;return"http://localhost:1337/restaurants/"}}]),DBHelper}();