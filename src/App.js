import React, { Component } from "react";
import { Provider } from "react-firebase-firestore";
import { initializeApp } from "firebase";
import "./App.css";
import CurrentDateProvider, { CurrentDateContext } from "./CurrentDate";
import AuthProvider from "./Auth";
import Main from "./component/Main";
import Timer from "./Timer";

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
        <AuthProvider firebase={firebase} provider={provider}>
          <CurrentDateProvider>
            <div className="App">
              <header className="App-header">
                <Timer />
                <h1 className="App-title">
                  <CurrentDateContext>
                    {({ state }) => `today is ${state.currentDate.toDateString()}`}
                  </CurrentDateContext>
                </h1>
                <div className="App-search">searchbar</div>
                <div>options</div>
              </header>
              <Main />
            </div>
          </CurrentDateProvider>
        </AuthProvider>
      </Provider>
    );
  }
}

export default App;
