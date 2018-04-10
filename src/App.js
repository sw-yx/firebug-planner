import React, { Component } from "react";
import { Provider } from "react-firebase-firestore";
import { initializeApp } from "firebase";
import "./App.css";
import CurrentDateProvider, { CurrentDateContext } from "./CurrentDate";
import Main from "./component/Main";

import AuthProvider, { Auth } from "./Auth";

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
var provider = new firebase.auth.GoogleAuthProvider();

class App extends Component {
  render() {
    return (
      <Provider firebaseApp={firebaseApp} firestore={firestore}>
        <CurrentDateProvider>
          <AuthProvider firebase={firebase} provider={provider}>
            <div className="App">
              <header className="App-header">
                <Auth provider={provider} firebase={firebase} />
                <h1 className="App-title">
                  <CurrentDateContext>
                    {({ state, handleDateChange }) =>
                      `today is ${state.currentDate.toDateString()}`
                    }
                  </CurrentDateContext>
                </h1>
                <div className="App-search">searchbar</div>
                <div>options</div>
              </header>
              <Main />
            </div>
          </AuthProvider>
        </CurrentDateProvider>
      </Provider>
    );
  }
}

export default App;
