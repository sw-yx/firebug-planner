import React, { Component } from "react";
import { Provider } from "react-firebase-firestore";
import { initializeApp } from "firebase";
import "./App.css";

import Main from "./component/Main";
import DateProvider, { DateContext } from "./CurrentDate";

var firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDVGfxKgd9WdGzR_dMxlG59YOsQ0oh_ryk",
  authDomain: "firebug-planner-7ec61.firebaseapp.com",
  databaseURL: "https://firebug-planner-7ec61.firebaseio.com",
  projectId: "firebug-planner-7ec61",
  storageBucket: "firebug-planner-7ec61.appspot.com",
  messagingSenderId: "887774219647"
});
const firestore = firebase.firestore();

class App extends Component {
  render() {
    return (
      <DateProvider>
        <Provider firebaseApp={firebaseApp} firestore={firestore}>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">
                <DateContext.Consumer>
                  {context => {
                    const { currentDate } = context.state;
                    return `today is ${currentDate.toDate().toDateString()}`;
                  }}
                </DateContext.Consumer>
              </h1>
            </header>
            <Main />;
          </div>
        </Provider>
      </DateProvider>
    );
  }
}

export default App;
