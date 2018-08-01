'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var keyEnter = 13;
var keySpace = 32;
var keyLeft = 37;
var keyRight = 39;
var keyUp = 38;
var keyDown = 40;

var FocusGroup = function () {
  function FocusGroup(nodeId, nodeClass) {
    var _this = this;

    _classCallCheck(this, FocusGroup);

    this.nodeId = nodeId;
    this.nodeClass = nodeClass;
    this.el = document.querySelector(nodeId);
    this.nodes = Array.from(this.el.querySelectorAll(nodeClass));
    this.focusIndex = 0;
    this.focusMax = this.nodes.length - 1;
    this.focusNode = this.nodes[this.focusIndex];

    //sets the tabIndex of all Array-like objects passed
    //adds event listener to all nodes to pass index through click event

    var _loop = function _loop(i) {
      if (_this.nodes[i] !== _this.focusNode) {
        _this.nodes[i].tabIndex = -1;
      } else {
        _this.nodes[i].tabIndex = 0;
      }
      _this.nodes[i].addEventListener('click', function (event, index) {
        return _this.pushKey(event, i);
      });
    };

    for (var i = 0; i <= this.focusMax; i++) {
      _loop(i);
    }

    this.el.addEventListener('keydown', function (event) {
      return _this.pushKey(event);
    });
  }

  _createClass(FocusGroup, [{
    key: 'pushKey',
    value: function pushKey(event, index) {
      if (event.keyCode === keyDown || event.keyCode === keyRight) {
        this.focusIndex === this.focusMax ? this.focusIndex = 0 : this.focusIndex++;
      }

      if (event.keyCode === keyUp || event.keyCode === keyLeft) {
        this.focusIndex === 0 ? this.focusIndex = this.focusMax : this.focusIndex--;
      }

      if (event.type === 'click') {
        this.focusIndex = index;
      }

      this.changeTabFocus(this.focusIndex);
    }
  }, {
    key: 'changeTabFocus',
    value: function changeTabFocus(index) {
      this.focusNode.tabIndex = -1;

      this.focusNode = this.nodes[index];
      this.focusNode.tabIndex = 0;
      this.focusNode.focus();
    }
  }]);

  return FocusGroup;
}();

var mapGroup = '';
var linkGroup = '';
var markerGroup = '';
var listObj = {};

function indexObjects() {
  markerGroup = new FocusGroup('.leaflet-marker-pane', '.leaflet-marker-icon');
  linkGroup = new FocusGroup('.leaflet-control-attribution', 'a');

  var restaurantArr = Array.from(document.querySelectorAll('#restaurants-list li'));
  var arrFunction = restaurantArr.map(function (listItem) {
    var itemID = listItem.id;
    listObj[itemID] = new FocusGroup('li#' + itemID, '.focus-item');
    // listObj[itemID] = `this is a test item ${itemID}`;
  });
}

var reviewsGroup = '';
var restaurantGroup = '';
var restaurantLinkGroup = '';

function restaurantObjects() {
  reviewsGroup = new FocusGroup('#reviews-container', '.focus-item');
  restaurantGroup = new FocusGroup('#restaurant-container', '.focus-item');
  restaurantLinkGroup = new FocusGroup('.leaflet-control-attribution', 'a');
}