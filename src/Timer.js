import React, { Component } from "react";
import { AuthContext } from "./Auth";

export default class Timer extends Component {
  state = {
    now: new Date()
  };
  componentDidMount() {
    setInterval(() => this.setState({ now: new Date() }), 1000);
  }
  render() {
    return (
      <AuthContext.Consumer>
        {({ state, loginUser, logoutUser }) => {
          const { currentUser } = state;
          const AuthSection = () =>
            currentUser ? (
              <span>
                Hello {currentUser.displayName} <button onClick={logoutUser}>Log out</button>
              </span> // theres someone logged in
            ) : (
              <button onClick={loginUser}>Log In</button>
            ); // logged out experience
          return (
            <div className="App-Timer">
              <div>
                <AuthSection />
              </div>
              <div>Timer: {this.state.now.toLocaleTimeString()}</div>
            </div>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}
