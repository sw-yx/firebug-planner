import React, { Component } from "react";

export const AuthContext = React.createContext();

export default class AuthProvider extends Component {
  state = {
    currentUser: null
  };
  logoutUser = () => {
    const { firebase } = this.props;
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.

        this.setState({ currentUser: null });
      })
      .catch(function(error) {
        // An error happened.
      });
  };
  loginUser = () => {
    const { firebase, provider } = this.props;
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        this.setState({ currentUser: user });
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.error("Error: ", errorMessage);
      });
  };
  render() {
    return (
      <AuthContext.Provider
        value={{
          state: this.state,
          loginUser: this.loginUser,
          logoutUser: this.logoutUser
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
