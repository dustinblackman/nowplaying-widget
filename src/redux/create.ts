import {createStore as _createStore} from "redux";
import {reducers} from "./reducers";

export default function createStore() {
  const store = _createStore(reducers);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers").reducers;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
