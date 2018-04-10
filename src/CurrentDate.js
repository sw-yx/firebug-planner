import React, { Component } from "react";

export const CurrentDateContext = React.createContext();

export default class CurrentDateProvider extends Component {
  state = {
    currentDate: new Date()
  };
  handleDateChange = date => {
    this.setState({
      currentDate: date
    });
  };
  render() {
    return (
      <CurrentDateContext.Provider
        value={{
          state: this.state,
          handleDateChange: this.handleDateChange
        }}
      >
        {this.props.children}
      </CurrentDateContext.Provider>
    );
  }
}
