'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventRegister = function () {
  function EventRegister() {
    _classCallCheck(this, EventRegister);
  }

  _createClass(EventRegister, null, [{
    key: 'addEventListener',
    value: function addEventListener(eventName, callback) {
      if (typeof eventName === 'string' && typeof callback === 'function') {
        EventRegister._Listeners.count++;
        var eventId = 'l' + EventRegister._Listeners.count;
        EventRegister._Listeners.refs[eventId] = {
          name: eventName,
          callback: callback
        };
        return eventId;
      }
      return false;
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(id) {
      if (typeof id === 'string') {
        return delete EventRegister._Listeners.refs[id];
      }
      return false;
    }
  }, {
    key: 'removeAllListeners',
    value: function removeAllListeners() {
      var removeError = false;
      Object.keys(EventRegister._Listeners.refs).forEach(function (_id) {
        var removed = delete EventRegister._Listeners.refs[_id];
        removeError = !removeError ? !removed : removeError;
      });
      return !removeError;
    }
  }, {
    key: 'emitEvent',
    value: function emitEvent(eventName, data) {
      Object.keys(EventRegister._Listeners.refs).forEach(function (_id) {
        if (EventRegister._Listeners.refs[_id] && eventName === EventRegister._Listeners.refs[_id].name) EventRegister._Listeners.refs[_id].callback(data);
      });
    }

    /*
     * shortener
     */

  }, {
    key: 'on',
    value: function on(eventName, callback) {
      return EventRegister.addEventListener(eventName, callback);
    }
  }, {
    key: 'rm',
    value: function rm(eventName) {
      return EventRegister.removeEventListener(eventName);
    }
  }, {
    key: 'rmAll',
    value: function rmAll() {
      return EventRegister.removeAllListeners();
    }
  }, {
    key: 'emit',
    value: function emit(eventName, data) {
      EventRegister.emitEvent(eventName, data);
    }
  }]);

  return EventRegister;
}();

EventRegister._Listeners = {
  count: 0,
  refs: {}
};
exports.EventRegister = EventRegister;

module.export = EventRegister;
exports.default = EventRegister;