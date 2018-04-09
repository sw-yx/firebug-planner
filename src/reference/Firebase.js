import { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

let config = {
  apiKey: "AIzaSyC9wMNrYmYqYAmwPfh0Y3gUwlf4PFYUnaI",
  authDomain: "planner-24f60.firebaseapp.com",
  databaseURL: "https://planner-24f60.firebaseio.com",
  projectId: "planner-24f60",
  storageBucket: "",
  messagingSenderId: "871155819426"
};
firebase.initializeApp(config);
let provider = new firebase.auth.GoogleAuthProvider();
let db = firebase.database();

class Firebase extends Component {
  state = {
    user: null,
    error: null
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  login = () => {
    firebase
      .auth()
      .signInWithRedirect(provider)
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    return this.props.children({
      ...this.state,
      login: this.login,
      db
    });
  }
}

export default Firebase;
