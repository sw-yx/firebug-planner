import React, { Component } from "react";
import { Provider } from "react-firebase-firestore";
// Required for side-effects
import firebase, { initializeApp } from "firebase";
import logo from "./logo.svg";
import "./App.css";

import Main from "./component/Main";

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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Provider firebaseApp={firebaseApp} firestore={firestore}>
          <Main />
        </Provider>
      </div>
    );
  }
}

export default App;
