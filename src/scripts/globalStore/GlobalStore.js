const GlobalStore = () => {
  const _store = {};
  const _subscribers = [];

  GlobalStore.prototype.setStore = function (key, value) {
    if (process.env.NODE_ENV !== "production") {
      console.log("prev store", _store);
    }

    _store[key] = value;

    if (process.env.NODE_ENV !== "production") {
      console.log("new store", _store);
    }

    this.handleStoreChange();
  };

  GlobalStore.prototype.getItem = function (key) {
    return _store[key];
  };

  GlobalStore.prototype.handleStoreChange = function () {
    for (let i = 0; i < _subscribers.length; i += 1) {
      const subscribeCallback = _subscribers[i];
      subscribeCallback(_store);
    }
  };

  GlobalStore.prototype.subscribe = function (callback) {
    _subscribers.push(callback);
  };
};

export default GlobalStore;
