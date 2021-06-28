const globalStore = (() => {
  const _store = {};
  const _subscribers = [];

  return {
    setStore(key, value) {
      _store[key] = value;
      this.handleStoreChange();
    },

    getItem(key) {
      return _store[key];
    },

    handleStoreChange() {
      for (let i = 0; i < _subscribers.length; i += 1) {
        const subscribeCallback = _subscribers[i];
        subscribeCallback(_store);
      }
    },

    subscribe(callback) {
      _subscribers.push(callback);
    },

    unsubscribe(callback) {
      const subscriberIndex = _subscribers
        .findIndex((subscriber) => callback === subscriber);

      if (subscriberIndex !== -1) {
        _subscribers.splice(subscriberIndex, 1);
      }
    },
  };
})();

export default globalStore;
