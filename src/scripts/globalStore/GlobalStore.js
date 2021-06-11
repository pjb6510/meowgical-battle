export default class GlobalStores {
  constructor() {
    this._store = {};
    this._subscribers = [];
  }

  setStore(key, value) {
    this._store[key] = value;
    this.handleStoreChange();
  }

  getItem(key) {
    return this._store[key];
  }

  handleStoreChange() {
    for (let i = 0; i < this._subscribers.length; i += 1) {
      const subscribeCallback = this._subscribers[i];
      subscribeCallback(this._store);
    }
  }

  subscribe(callback) {
    this._subscribers.push(callback);
  }

  unsubscribe(callback) {
    const subscriberIndex = this._subscribers
      .findIndex((subscriber) => callback === subscriber);

    if (subscriberIndex !== -1) {
      this._subscribers.splice(subscriberIndex, 1);
    }
  }
}
