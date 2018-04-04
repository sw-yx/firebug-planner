import React, { Component } from "react";
import { Provider } from "react-firebase-firestore";
import { initializeApp } from "firebase";
import "./App.css";
import moment from "moment";

import Main from "./component/Main";

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
  state = {
    currentDate: moment()
  };
  handleDateChange = date => {
    this.setState({
      currentDate: date
    });
  };
  render() {
    const { currentDate } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            today is {currentDate.toDate().toDateString()}
          </h1>
        </header>
        <Provider firebaseApp={firebaseApp} firestore={firestore}>
          <Main
            currentDate={currentDate}
            handleDateChange={this.handleDateChange}
          />
        </Provider>
      </div>
    );
  }
}

export default App;
