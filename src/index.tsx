import * as React from "react";
import {render} from "react-dom";
import {AppContainer} from "react-hot-loader";
import {Provider} from "react-redux";

import App from "./App";
import createStore from "./redux/create";

render(
  <AppContainer>
    <Provider store={createStore()}>
      <App />
    </Provider>
  </AppContainer>,
  document.getElementById("root")
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default; // tslint:disable-line
    render(
      <AppContainer>
        <Provider store={createStore()}>
          <NextApp />
        </Provider>
      </AppContainer>,
      document.getElementById("root")
    );
  });
}
