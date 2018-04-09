import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppContainer as HotContainer } from "react-hot-loader";
import registerServiceWorker from "./registerServiceWorker";

let el = document.getElementById("root");

if (process.env.NODE_ENV === "production") {
  ReactDOM.render(<App />, el);
} else {
  ReactDOM.render(
    <HotContainer>
      <App />
    </HotContainer>,
    el
  );

  if (module.hot) {
    module.hot.accept("./App", () => {
      const NextApp = require("./App").default; // eslint-disable-line global-require
      ReactDOM.render(
        <HotContainer>
          <NextApp />
        </HotContainer>,
        el
      );
    });
  }
}

registerServiceWorker();
