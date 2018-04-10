import React, { Component } from "react";

class Timer extends Component {
  state = {
    now: new Date()
  };
  componentDidMount() {
    setInterval(() => this.setState({ now: new Date() }), 1000);
  }
  render() {
    return (
      <div className="App-Timer">
        Timer: {this.state.now.toLocaleTimeString()}
      </div>
    );
  }
}

export class Auth extends Component {
  render() {
    return (
      <div>
        <AuthContext>
          {({ state, loginUser, logoutUser }) => {
            const { user } = state;
            const LogoutButton = () => (
              <div>
                Hi, {user.displayName}
                <button onClick={logoutUser}>Log out</button>
              </div>
            );
            const LoginButton = () => (
              <button onClick={loginUser}>Log in</button>
            );
            return user ? <LogoutButton /> : <LoginButton />;
          }}
        </AuthContext>
        <Timer />
      </div>
    );
  }
}

export const AuthContext = React.createContext();

export default class AuthProvider extends Component {
  state = {
    user: null
  };
  loginUser = () => {
    this.props.firebase
      .auth()
      .signInWithPopup(this.props.provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.setState({
          user: user
        });
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
        console.error(error.message);
      });
  };
  logoutUser = () => {
    this.props.firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        this.setState({
          user: user
        });
      })
      .catch(function(error) {
        // An error happened.
        console.error(error.message);
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
