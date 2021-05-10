import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";

import reducer from "./reducers";

const middleware = [];

if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

const store = createStore(reducer, applyMiddleware(...middleware));

const dispatch = store.dispatch;
const getState = store.getState;
const subscribe = store.subscribe;

export { store, dispatch, getState, subscribe };
